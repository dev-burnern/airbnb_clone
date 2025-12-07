"use client";

import React from "react";
import { Upload, X } from "lucide-react";

interface Step12PhotoUploadProps {
  formData: {
    photos: string[];
  };
  onUpdate: (data: any) => void;
}

const Step12PhotoUpload: React.FC<Step12PhotoUploadProps> = ({
  formData,
  onUpdate,
}) => {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 파일을 Base64로 변환하여 localStorage에 저장 가능하게 함
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      const newPhotos = await Promise.all(filePromises);
      onUpdate({
        ...formData,
        photos: [...formData.photos, ...newPhotos],
      });
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    onUpdate({ ...formData, photos: newPhotos });
  };

  const hasMinimumPhotos = formData.photos.length >= 5;

  return (
    <div className="py-6">
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-2">
          5장 이상의 사진을 선택하세요.
        </h1>
        <p className="text-sm text-gray-600 mb-6">드래그하여 순서 변경</p>

        {/* Cover Photo */}
        {formData.photos.length > 0 && (
          <div className="mb-4">
            <div className="relative group">
              <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                커버 사진
              </div>
              <button
                onClick={() => removePhoto(0)}
                className="absolute top-3 right-3 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition z-10"
              >
                <X size={16} />
              </button>
              <img
                src={formData.photos[0]}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {formData.photos.slice(1).map((photo, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => removePhoto(index + 1)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
              >
                <X size={16} />
              </button>
              <img
                src={photo}
                alt={`Photo ${index + 2}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          ))}

          {/* Upload Button */}
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-gray-900 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload size={24} className="text-gray-400" />
          </label>
        </div>

        <p className="text-sm text-gray-500">
          {formData.photos.length > 0 
            ? `현재 ${formData.photos.length}장의 사진이 추가되었습니다. (권장: 5장 이상)`
            : "최소 1장의 사진이 필요합니다."}
        </p>
      </div>
    </div>
  );
};

export default Step12PhotoUpload;
