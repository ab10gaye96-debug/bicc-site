import { useEffect, useRef, useState } from 'react';
import { Film, Image as ImageIcon, Link2, Loader2, Trash2, Upload, FolderOpen, Plus } from 'lucide-react';
import * as api from '../../api';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|m4v|mkv)(\?|$)/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

function isVideoFile(file: File) {
  return file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|mkv)$/i.test(file.name);
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getUploadErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('unauthorized') || message.includes('permission')) {
    return 'Upload denied. Make sure you are signed in as an admin with upload permissions.';
  }
  if (message.includes('size') || message.includes('payload')) {
    return 'File is too large. Images max 20MB, videos max 100MB.';
  }
  return message || 'Upload failed. Please try again.';
}

interface MediaFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'video' | 'both';
  uploadFolder?: string;
  helpText?: string;
  placeholder?: string;
}

export function MediaField({
  label,
  value,
  onChange,
  accept = 'image',
  uploadFolder = 'other',
  helpText,
  placeholder = 'Paste a direct image or video URL',
}: MediaFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptAttr =
    accept === 'video' ? 'video/*' : accept === 'both' ? 'image/*,video/*' : 'image/*';

  const handleUpload = async (file: File) => {
    setError('');
    const isVideo = isVideoFile(file);
    if (accept === 'image' && isVideo) {
      setError('Please choose an image file.');
      return;
    }
    if (accept === 'video' && !isVideo) {
      setError('Please choose a video file.');
      return;
    }
    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      setError(`File is too large (${formatBytes(file.size)}). Max ${isVideo ? '100MB' : '20MB'}.`);
      return;
    }

    setUploading(true);
    try {
      const uploaded = await api.uploadAdminAsset(file, uploadFolder);
      onChange(uploaded.url);
    } catch (err) {
      setError(getUploadErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const previewIsVideo = value ? isVideoUrl(value) : false;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1F85A8]">{label}</label>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs text-blue-900">
        Add media in any of these ways: <strong>upload/import a file</strong>, choose an existing file from the
        <strong> Media Library</strong>, or <strong>paste a direct file link</strong> below.
      </div>

      {value && (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
          {previewIsVideo ? (
            <video src={value} controls className="w-full max-h-48 bg-black" />
          ) : (
            <img src={value} alt="" className="w-full max-h-48 object-cover" />
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : 'Upload / import file'}
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
        >
          <FolderOpen size={14} />
          Media library
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100"
          >
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Direct file link
        </label>
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          />
          <span className="inline-flex items-center text-gray-400" title="Paste direct file link">
            <Link2 size={16} />
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          Example: a direct `.jpg`, `.png`, `.webp`, `.svg`, or video file URL.
        </p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />

      {showLibrary && (
        <MediaLibraryPicker
          accept={accept}
          onSelect={(url) => {
            onChange(url);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

interface ImageListFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  uploadFolder?: string;
  helpText?: string;
}

export function ImageListField({
  label,
  value,
  onChange,
  uploadFolder = 'hero',
  helpText,
}: ImageListFieldProps) {
  const images = Array.isArray(value) ? value.filter(Boolean) : [];

  const updateImage = (index: number, nextValue: string) => {
    const nextImages = [...images];
    nextImages[index] = nextValue;
    onChange(nextImages);
  };

  const addImage = () => onChange([...images, '']);
  const removeImage = (index: number) => onChange(images.filter((_, imageIndex) => imageIndex !== index));

  return (
    <div className="space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50/70">
      <div>
        <label className="block text-sm font-medium text-[#1F85A8]">{label}</label>
        {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
      </div>

      {images.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500 text-center">
          No slideshow images added yet.
        </div>
      )}

      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={`image-${index}`} className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-700">Slide {index + 1}</p>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>

            <MediaField
              label={`Slide ${index + 1} image`}
              value={image}
              onChange={(url) => updateImage(index, url)}
              accept="image"
              uploadFolder={uploadFolder}
              helpText="Upload/import an image, choose one from Media Library, or paste a direct image link."
              placeholder="Paste a direct image URL"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
      >
        <Plus size={14} />
        Add slideshow image
      </button>
    </div>
  );
}

interface MediaListFieldProps {
  label: string;
  images: string[];
  videos: string[];
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
  uploadFolder?: string;
}

export function MediaListField({
  label,
  images,
  videos,
  onImagesChange,
  onVideosChange,
  uploadFolder = 'venues',
}: MediaListFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryMode, setLibraryMode] = useState<'image' | 'video'>('image');
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<'image' | 'video'>('image');

  const handleUpload = async (file: File) => {
    setError('');
    const isVideo = isVideoFile(file);
    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      setError(`File too large. Max ${isVideo ? '100MB' : '20MB'}.`);
      return;
    }

    setUploading(true);
    try {
      const uploaded = await api.uploadAdminAsset(file, uploadFolder);
      if (uploaded.assetType === 'video') {
        onVideosChange([...videos, uploaded.url]);
      } else {
        onImagesChange([...images, uploaded.url]);
      }
    } catch (err) {
      setError(getUploadErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => onImagesChange(images.filter((_, i) => i !== index));
  const removeVideo = (index: number) => onVideosChange(videos.filter((_, i) => i !== index));

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div>
        <label className="block text-sm font-medium text-[#1F85A8]">{label}</label>
        <p className="text-xs text-gray-500 mt-1">
          Add one or more photos and optional videos. The first image is used as the cover on the website.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setUploadMode('image'); fileRef.current?.click(); }}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading && uploadMode === 'image' ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
          Add image
        </button>
        <button
          type="button"
          onClick={() => { setUploadMode('video'); fileRef.current?.click(); }}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
        >
          {uploading && uploadMode === 'video' ? <Loader2 size={14} className="animate-spin" /> : <Film size={14} />}
          Add video
        </button>
        <button
          type="button"
          onClick={() => { setLibraryMode('image'); setShowLibrary(true); }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
        >
          <FolderOpen size={14} />
          Pick from library
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={uploadMode === 'video' ? 'video/*' : 'image/*'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {(images.length > 0 || videos.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={`img-${url}-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200">
              <img src={url} alt="" className="w-full aspect-[4/3] object-cover" />
              {index === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">Cover</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {videos.map((url, index) => (
            <div key={`vid-${url}-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200">
              <video src={url} className="w-full aspect-[4/3] object-cover bg-black" muted />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full">Video</span>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showLibrary && (
        <MediaLibraryPicker
          accept={libraryMode}
          onSelect={(url) => {
            if (isVideoUrl(url)) onVideosChange([...videos, url]);
            else onImagesChange([...images, url]);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

function MediaLibraryPicker({
  accept,
  onSelect,
  onClose,
}: {
  accept: 'image' | 'video' | 'both';
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api.fetchMediaLibrary().then((data) => {
      setItems(data.filter((item) => item.active !== false));
      setLoading(false);
    });
  }, []);

  const filtered = items.filter((item) => {
    if (accept === 'image') return item.assetType === 'image';
    if (accept === 'video') return item.assetType === 'video';
    return true;
  });

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 p-4 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-[#1F85A8]">Choose from Media Library</h3>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">Close</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No media found. Upload files in the Media Library tab first.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-500 text-left"
                >
                  {item.assetType === 'video' ? (
                    <video src={item.url} className="w-full aspect-video object-cover bg-black" muted />
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full aspect-video object-cover" />
                  )}
                  <p className="p-2 text-xs font-medium text-gray-700 truncate">{item.title || item.fileName}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
