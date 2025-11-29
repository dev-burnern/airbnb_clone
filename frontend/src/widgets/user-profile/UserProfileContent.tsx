'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Globe, CheckCircle, Star, MessageSquare, Camera } from 'lucide-react';
import { ProfileData, Review, Trip } from '../../hooks/useProfile';

// --- 공통 컴포넌트: 프로필 사이드바 항목 ---
interface NavItemProps {
    icon: React.ElementType;
    title: string;
    isSelected: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, title, isSelected, onClick }) => (
  <button
    className={`flex items-center space-x-3 p-3 rounded-xl transition duration-150 w-full text-left 
      ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span>{title}</span>
  </button>
);

// 작은 정보 뱃지 컴포넌트
const InfoBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-sm">
        <p className="text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
);

// 후기 카드 컴포넌트
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="space-y-3 mb-6">
    <div className="flex items-center space-x-3">
      <img src={review.reviewerImage} alt={review.reviewerName} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <p className="font-semibold text-gray-800">{review.reviewerName}</p>
        <p className="text-sm text-gray-500">{review.location}</p>
      </div>
    </div>
    <p className="text-sm text-gray-500">{review.date}</p>
    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
  </div>
);

const SelfIntroTab: React.FC<{ profile: ProfileData }> = ({ profile }) => (
  <div className="space-y-12">
    {/* Summary Card */}
    <div className="flex items-start p-6 border border-gray-200 rounded-xl shadow-sm max-w-sm">
      <div className="flex-shrink-0 mr-6">
        <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-4xl text-white font-bold" 
             style={{ backgroundImage: `url(${profile.profileImage})`, backgroundSize: 'cover' }}>
            {profile.profileImage ? '' : profile.name.charAt(0)}
        </div>
        <div className="mt-2 text-center">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-2 text-gray-600 border-l pl-6">
        <InfoBadge label="에어비앤비를 통한 여행" value={`${profile.tripCount}회`} />
        <InfoBadge label="후기" value={`${profile.reviewCount}개`} />
        <InfoBadge label="에어비앤비 멤버 가입 기간" value={profile.memberSince} />
      </div>
    </div>
  

    {/* Reviews Section */}
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6">후기 ({profile.reviews.length}개)</h3>
      {profile.reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
      <button className="mt-8 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">
        후기 모두 표시하기
      </button>
      
      <div className="mt-12 pt-6 border-t border-gray-200 flex items-center text-gray-500">
        <MessageSquare className="w-5 h-5 mr-2" />
        <p className="text-sm">내가 작성한 후기</p>
      </div>
    </div>
  </div>
);

const PreviousTripsTab: React.FC<{ trips: Trip[] }> = ({ trips }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-4">이전 여행</h2>
    
    {trips.map((trip, index) => (
      <div key={index} className="space-y-6">
        <h3 className="text-xl font-bold mt-4">{trip.year}</h3>
        <div className="flex items-center space-x-6 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition duration-300">
          <img 
            src={trip.image} 
            alt={trip.listingName} 
            className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{trip.listingName}</p>
            <p className="text-sm text-gray-500 mt-1">{trip.dates}</p>
            <div className="flex items-center text-sm mt-1 text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                <span className="text-gray-600">4.9 (후기 50개)</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ProfileContentProps {
    profile: ProfileData;
}

export const UserProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('self_intro');

  const renderContent = () => {
    switch (activeTab) {
      case 'self_intro':
        return <SelfIntroTab profile={profile} />;
      case 'previous_trips':
        return <PreviousTripsTab trips={profile.trips} />;
      default:
        return <SelfIntroTab profile={profile} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        
        {/* Sidebar Navigation */}
        <nav className="lg:w-1/4 w-full mb-8 lg:mb-0 lg:sticky lg:top-10 h-max">
          <div className="space-y-1">
            <NavItem
              icon={User}
              title="자기소개"
              isSelected={activeTab === 'self_intro'}
              onClick={() => setActiveTab('self_intro')}
            />
            <NavItem
              icon={Globe}
              title="이전 여행"
              isSelected={activeTab === 'previous_trips'}
              onClick={() => setActiveTab('previous_trips')}
            />
          </div>
        </nav>

        {/* Main Content */}
        <main className="lg:w-3/4 w-full">
          {activeTab === 'self_intro' && (
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900">자기소개</h1>
              
              <Link href="/account/profile/edit" passHref>
                <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                  수정
                </button>
              </Link>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};