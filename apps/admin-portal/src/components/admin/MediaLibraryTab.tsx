import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, Eye, X, Search, Filter, RefreshCw, AlertCircle, CheckCircle, FolderOpen } from 'lucide-react';
import { storage, db } from '../../firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';

interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  category: string;
  title: string;
  altText: string;
  fileSize: number;
  dimensions?: string;
  uploadedAt: string;
  uploadedBy: string;
  usedIn: string[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Media', color: 'gray' },
  { id: 'hero', label: 'Hero Images', color: 'blue' },
  { id: 'logos', label: 'Logos', color: 'purple' },
  { id: 'venues', label: 'Venues', color: 'green' },
  { id: 'events', label: 'Events', color: 'yellow' },
  { id: 'gallery', label: 'Gallery', color: 'pink' },
  { id: 'partners', label: 'Partners', color: 'indigo' },
  { id: 'team', label: 'Team Photos', color: 'red' },
  { id: 'other', label: 'Other', color: 'gray' },
];

export default function MediaLibraryTab() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    filterMedia();
  }, [media, selectedCategory, searchQuery]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'mediaLibrary'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MediaItem));
      
      setMedia(items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (error) {
      console.error('Error loading media:', error);
      showMessage('error', 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = media;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.fileName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.altText.toLowerCase().includes(query)
      );
    }
    
    setFilteredMedia(filtered);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const category = selectedCategory === 'all' ? 'other' : selectedCategory;
    
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], category);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File, category: string) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('error', `${file.name} is not an image file`);
        return;
      }

      // Compress image if needed
      const processedFile = await compressImage(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
      const fileName = `${timestamp}-${sanitizedName}`;
      const storagePath = `media/${category}/${fileName}`;

      // Upload to Firebase Storage
      const fileRef = storageRef(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, processedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload error:', error);
          showMessage('error', `Failed to upload ${file.name}`);
          setUploading(false);
        },
        async () => {
          // Upload complete, get URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Get image dimensions
          const dimensions = await getImageDimensions(downloadURL);

          // Save metadata to Firestore
          const username = localStorage.getItem('bicc_username') || 'admin';
          const mediaDoc = {
            url: downloadURL,
            fileName: file.name,
            category,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            altText: '',
            fileSize: file.size,
            dimensions,
            uploadedAt: new Date().toISOString(),
            uploadedBy: username,
            usedIn: [],
          };

          await addDoc(collection(db, 'mediaLibrary'), mediaDoc);
          
          showMessage('success', `${file.name} uploaded successfully!`);
          await loadMedia();
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage('error', `Failed to upload ${file.name}`);
      setUploading(false);
    }
  };

  const compressImage = async (file: File, maxWidth: number = 1920, quality: number = 0.85): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality);
        };
      };
    });
  };

  const getImageDimensions = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(`${img.width}x${img.height}`);
      img.onerror = () => resolve('Unknown');
      img.src = url;
    });
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.fileName}"? This action cannot be undone.`)) return;

    try {
      // Delete from Storage
      const fileRef = storageRef(storage, `media/${item.category}/${item.fileName}`);
      await deleteObject(fileRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'mediaLibrary', item.id));

      showMessage('success', 'Image deleted successfully');
      await loadMedia();
    } catch (error) {
      console.error('Error deleting image:', error);
      showMessage('error', 'Failed to delete image');
    }
  };

  const handleUpdateMetadata = async (item: MediaItem, updates: Partial<MediaItem>) => {
    try {
      await updateDoc(doc(db, 'mediaLibrary', item.id), updates);
      showMessage('success', 'Metadata updated');
      await loadMedia();
    } catch (error) {
      console.error('Error updating metadata:', error);
      showMessage('error', 'Failed to update metadata');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find(c => c.id === category)?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Media Library</h2>
          <p className="text-sm text-gray-500 mt-1">Upload and manage all website images</p>
        </div>
        <button
          onClick={handleFileSelect}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? `Uploading ${uploadProgress}%` : 'Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-2">FILTER BY CATEGORY</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                  {cat.id !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({media.filter(m => m.category === cat.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full sm:w-64">
            <label className="block text-xs font-medium text-gray-500 mb-2">SEARCH</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4">
          <div className="text-2xl font-bold text-[#1F85A8]">{media.length}</div>
          <div className="text-sm text-gray-500">Total Images</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-2xl font-bold text-[#1F85A8]">
            {formatFileSize(media.reduce((sum, item) => sum + item.fileSize, 0))}
          </div>
          <div className="text-sm text-gray-500">Total Size</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-2xl font-bold text-[#1F85A8]">{filteredMedia.length}</div>
          <div className="text-sm text-gray-500">Filtered Results</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="text-2xl font-bold text-[#1F85A8]">
            {CATEGORIES.filter(c => c.id !== 'all').length}
          </div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'No images match your filters' : 'No images uploaded yet'}
          </p>
          <button
            onClick={handleFileSelect}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Upload Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
              <div className="relative aspect-square">
                <img
                  src={item.url}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all"
                    title="View details"
                  >
                    <Eye size={18} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg backdrop-blur-sm transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
                <div className={`absolute top-2 right-2 px-2 py-1 bg-${getCategoryColor(item.category)}-500 text-white text-xs font-semibold rounded-full`}>
                  {CATEGORIES.find(c => c.id === item.category)?.label.replace(' Images', '').replace(' Photos', '')}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(item.fileSize)} • {item.dimensions}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Details Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1F85A8]">Image Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText || selectedImage.title}
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-2">IMAGE URL</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedImage.url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedImage.url);
                          showMessage('success', 'URL copied to clipboard');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Title</label>
                    <input
                      type="text"
                      value={selectedImage.title}
                      onChange={e => setSelectedImage({...selectedImage, title: e.target.value})}
                      onBlur={e => handleUpdateMetadata(selectedImage, {title: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Alt Text (for SEO)</label>
                    <input
                      type="text"
                      value={selectedImage.altText}
                      onChange={e => setSelectedImage({...selectedImage, altText: e.target.value})}
                      onBlur={e => handleUpdateMetadata(selectedImage, {altText: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">File Name</label>
                      <p className="text-sm text-gray-800">{selectedImage.fileName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                      <p className="text-sm text-gray-800 capitalize">{selectedImage.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">File Size</label>
                      <p className="text-sm text-gray-800">{formatFileSize(selectedImage.fileSize)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Dimensions</label>
                      <p className="text-sm text-gray-800">{selectedImage.dimensions}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Uploaded By</label>
                      <p className="text-sm text-gray-800">{selectedImage.uploadedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Upload Date</label>
                      <p className="text-sm text-gray-800">
                        {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedImage.usedIn.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Used In</label>
                      <div className="space-y-1">
                        {selectedImage.usedIn.map((location, i) => (
                          <div key={i} className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg">
                            {location}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleDelete(selectedImage);
                        setSelectedImage(null);
                      }}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      Delete Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}