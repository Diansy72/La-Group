"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Button from "@/components/atoms/button";
import { cn } from "@/lib/cn";
import {
  Plus,
  X,
  Check,
  Star,
  Pencil,
  Trash2,
  User,
  Play,
  Video,
} from "lucide-react";
import { Tourist, GoogleReview } from "@/types";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import ImageUpload from "@/components/molecules/ImageUpload";
import VideoUpload from "@/components/molecules/VideoUpload";
import VideoPlayerModal from "@/components/organisms/VideoPlayerModal";
import { useTranslations } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";
import { toast } from "react-hot-toast";

const CONTINENTS = ["All", "Asia", "Europe", "Americas"] as const;

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AboutUsContent() {
  const t = useTranslations("Dashboard.testimonialsGallery");
  const sidebarT = useTranslations("Dashboard.sidebar");
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "reviews" ? "reviews" : "gallery";

  // Tourist Gallery State
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [isLoadingTourists, setIsLoadingTourists] = useState(true);
  const [continentFilter, setContinentFilter] = useState<string>("All");
  const [showTouristForm, setShowTouristForm] = useState(false);
  const [editTourist, setEditTourist] = useState<Tourist | null>(null);
  const [touristForm, setTouristForm] = useState({
    nationality: "",
    continent: "Asia" as Tourist["continent"],
    packageTaken: "",
    photoUrl: "",
  });

  // Google Reviews State
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editReview, setEditReview] = useState<GoogleReview | null>(null);
  const [mediaSelect, setMediaSelect] = useState<"none" | "image" | "video">("none");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    country: "",
    rating: 5,
    comment: "",
    avatarPath: "",
    imagePath: "",
    videoPath: "",
  });

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "tourist" | "review"; id: string; name: string } | null>(null);

  // Video playback state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // ==================== FETCH DATA ====================
  const fetchTourists = async () => {
    try {
      const res = await fetch("/api/tourists");
      const data = await res.json();
      if (Array.isArray(data)) setTourists(data);
    } catch (err) {
      console.error("Failed to fetch tourists:", err);
    } finally {
      setIsLoadingTourists(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchTourists();
    fetchReviews();
  }, []);

  // Filtered tourists
  const filteredTourists = useMemo(() => {
    if (continentFilter === "All") return tourists;
    return tourists.filter((t) => t.continent === continentFilter);
  }, [tourists, continentFilter]);

  // ==================== TOURIST CRUD ====================
  const openTouristForm = (tourist?: Tourist) => {
    if (tourist) {
      setEditTourist(tourist);
      setTouristForm({
        nationality: tourist.nationality,
        continent: tourist.continent,
        packageTaken: tourist.packageTaken,
        photoUrl: tourist.photoUrl || "",
      });
    } else {
      setEditTourist(null);
      setTouristForm({ nationality: "", continent: "Asia", packageTaken: "", photoUrl: "" });
    }
    setShowTouristForm(true);
  };

  const handleSaveTourist = async () => {
    if (!touristForm.nationality || !touristForm.packageTaken) return;
    setIsSaving(true);

    try {
      if (editTourist) {
        const res = await fetch(`/api/tourists/${editTourist.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(touristForm),
        });
        if (res.ok) {
          const updated = await res.json();
          setTourists((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          setTouristForm({ nationality: "", continent: "Asia", packageTaken: "", photoUrl: "" });
          setEditTourist(null);
          setShowTouristForm(false);
          toast.success("Tourist gallery updated successfully!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to update tourist");
        }
      } else {
        const res = await fetch("/api/tourists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(touristForm),
        });
        if (res.ok) {
          const created = await res.json();
          setTourists((prev) => [created, ...prev]);
          setTouristForm({ nationality: "", continent: "Asia", packageTaken: "", photoUrl: "" });
          setEditTourist(null);
          setShowTouristForm(false);
          toast.success("Tourist gallery added successfully!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to create tourist");
        }
      }
    } catch (err) {
      console.error("Failed to save tourist:", err);
      toast.error("Failed to save tourist. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTourist = async (id: string) => {
    try {
      const res = await fetch(`/api/tourists/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTourists((prev) => prev.filter((t) => t.id !== id));
        toast.success("Tourist gallery item deleted!");
      } else {
        toast.error("Failed to delete tourist gallery item.");
      }
    } catch (err) {
      console.error("Failed to delete tourist:", err);
      toast.error("Failed to delete tourist.");
    }
  };

  // ==================== REVIEW CRUD ====================
  const openReviewForm = (review?: GoogleReview) => {
    if (review) {
      setEditReview(review);
      setReviewForm({
        name: review.name,
        country: review.country,
        rating: review.rating,
        comment: review.comment,
        avatarPath: review.avatarPath || "",
        imagePath: review.mediaType === "image" ? review.mediaPath || "" : "",
        videoPath: review.mediaType === "video" ? review.mediaPath || "" : "",
      });
      setMediaSelect((review.mediaType as any) || "none");
    } else {
      setEditReview(null);
      setReviewForm({
        name: "",
        country: "",
        rating: 5,
        comment: "",
        avatarPath: "",
        imagePath: "",
        videoPath: "",
      });
      setMediaSelect("none");
    }
    setShowReviewForm(true);
  };

  const handleSaveReview = async () => {
    if (!reviewForm.name || !reviewForm.comment) return;
    setIsSaving(true);

    const payload = {
      name: reviewForm.name,
      country: reviewForm.country,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      avatarPath: reviewForm.avatarPath || null,
      mediaType: mediaSelect === "none" ? null : mediaSelect,
      mediaPath:
        mediaSelect === "none"
          ? null
          : mediaSelect === "image"
          ? reviewForm.imagePath
          : reviewForm.videoPath,
    };

    try {
      if (editReview) {
        const res = await fetch(`/api/reviews/${editReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          setReviewForm({ name: "", country: "", rating: 5, comment: "", avatarPath: "", imagePath: "", videoPath: "" });
          setMediaSelect("none");
          setEditReview(null);
          setShowReviewForm(false);
          toast.success("Review updated successfully!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to update review");
        }
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setReviews((prev) => [created, ...prev]);
          setReviewForm({ name: "", country: "", rating: 5, comment: "", avatarPath: "", imagePath: "", videoPath: "" });
          setMediaSelect("none");
          setEditReview(null);
          setShowReviewForm(false);
          toast.success("Review added successfully!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to create review");
        }
      }
    } catch (err) {
      console.error("Failed to save review:", err);
      toast.error("Failed to save review. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted successfully!");
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error("Failed to delete review.");
    }
  };

  // Dynamic Title & Subtitle based on active subpage
  const title = activeTab === "gallery" ? t("touristGallery") : t("googleReviews");
  const description = activeTab === "gallery" 
    ? "Kelola data dan foto galeri wisatawan asing dari berbagai benua" 
    : "Kelola ulasan bintang dan testimoni video dari pelanggan di Google";

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard"), href: "/dashboard" },
        { label: sidebarT("testimonialsGallery") },
      ]}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* ===================== TOURIST GALLERY TAB ===================== */}
      {activeTab === "gallery" && (
        <>
          {/* Continent Filter + Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setContinentFilter(c)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border",
                    continentFilter === c
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-900/50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <Button
              icon={<Plus size={16} />}
              onClick={() => openTouristForm()}
            >
              {t("addTourist")}
            </Button>
          </div>

          {/* Add/Edit Tourist Modal */}
          {showTouristForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editTourist ? t("editTourist") : t("addTourist")}
                  </h3>
                  <button
                    onClick={() => { setShowTouristForm(false); setEditTourist(null); }}
                    className="p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      {t("photo")}
                    </label>
                    <ImageUpload
                      value={touristForm.photoUrl}
                      onChange={(url: string) => setTouristForm({ ...touristForm, photoUrl: url })}
                      folder="about-us/tourist-gallery"
                      onUploading={setIsUploadingFile}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      {t("nationality")}
                    </label>
                    <input
                      type="text"
                      value={touristForm.nationality}
                      onChange={(e) => setTouristForm({ ...touristForm, nationality: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                      placeholder="e.g. Japan 🇯🇵"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">
                        {t("continent")}
                      </label>
                      <select
                        value={touristForm.continent}
                        onChange={(e) => setTouristForm({ ...touristForm, continent: e.target.value as Tourist["continent"] })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
                      >
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Americas">Americas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">
                        {t("packageTaken")}
                      </label>
                      <input
                        type="text"
                        value={touristForm.packageTaken}
                        onChange={(e) => setTouristForm({ ...touristForm, packageTaken: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                        placeholder="e.g. Bali Explorer"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="blue" onClick={() => { setShowTouristForm(false); setEditTourist(null); }} disabled={isSaving || isUploadingFile}>
                    {t("cancel")}
                  </Button>
                  <Button 
                    icon={<Check size={16} />} 
                    onClick={handleSaveTourist}
                    isLoading={isSaving}
                    disabled={isUploadingFile}
                  >
                    {editTourist ? t("update") : t("save")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tourist Cards Grid */}
          {isLoadingTourists ? (
            <div className="flex justify-center p-10">
              <p className="text-gray-500">{t("loadingTourists")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredTourists.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-400">
                  {t("noTourists")}
                </div>
              ) : (
                filteredTourists.map((tourist) => (
                  <div
                    key={tourist.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    {/* Gradient header with avatar */}
                    <div className="h-48 overflow-hidden">
                      {tourist.photoUrl ? (
                        <img src={getPublicUrl(tourist.photoUrl)} alt={tourist.nationality} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gradient-to-br from-[#003B73] to-[#0059A7] h-full flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                            <User size={32} className="text-white/60" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {tourist.nationality}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tourist.packageTaken}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {tourist.continent}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => openTouristForm(tourist)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-900 bg-blue-900/5 hover:bg-blue-900/10 transition-colors cursor-pointer"
                        >
                          <Pencil size={12} /> {t("update")}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: "tourist", id: tourist.id, name: tourist.nationality })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* ===================== GOOGLE REVIEWS TAB ===================== */}
      {activeTab === "reviews" && (
        <>
          {/* Add Review Button */}
          <div className="flex items-center justify-end mb-6">
            <Button
              icon={<Plus size={16} />}
              onClick={() => openReviewForm()}
            >
              {t("addReview")}
            </Button>
          </div>

          {/* Add/Edit Review Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
              <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editReview ? t("editReview") : t("addReview")}
                  </h3>
                  <button
                    onClick={() => { setShowReviewForm(false); setEditReview(null); }}
                    className="p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                  {/* Left Side: Form Fields */}
                  <div className="md:col-span-3 space-y-6">
                    {/* Section 1: Customer Info */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900/60 border-b border-gray-100 pb-1">
                        {t("customerInfo")}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t("name")}
                          </label>
                          <input
                            type="text"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                            placeholder="e.g. John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t("country")}
                          </label>
                          <input
                            type="text"
                            value={reviewForm.country}
                            onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                            placeholder="e.g. USA 🇺🇸"
                          />
                        </div>
                      </div>
                      {/* Avatar Upload - compact size */}
                      <div className="w-28">
                        <ImageUpload
                          label="Avatar"
                          value={reviewForm.avatarPath}
                          onChange={(url: string) => setReviewForm({ ...reviewForm, avatarPath: url })}
                          aspectRatio="aspect-square"
                          folder="about-us/google-reviews/avatars"
                          onUploading={setIsUploadingFile}
                        />
                      </div>
                    </div>

                    {/* Section 2: Review Content */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900/60 border-b border-gray-100 pb-1">
                        {t("reviewContent")}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t("rating")}
                          </label>
                          <div className="flex items-center gap-1 p-1.5 bg-gray-50 rounded-lg w-fit border border-gray-200">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                                className="cursor-pointer hover:scale-110 transition-transform"
                              >
                                <Star
                                  size={24}
                                  className={cn(
                                    "transition-colors",
                                    s <= reviewForm.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t("comment")}
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
                            placeholder="Write customer review..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Media Upload */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900/60 border-b border-gray-100 pb-1">
                        {t("mediaUpload")}
                      </h4>
                      <div className="space-y-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Media Type
                        </label>
                        <div className="flex items-center gap-2">
                          {(["none", "image", "video"] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setMediaSelect(type);
                              }}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border capitalize",
                                mediaSelect === type
                                  ? "bg-blue-900 text-white border-blue-900"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-900/50"
                              )}
                            >
                              {type === "none" ? "None" : type === "image" ? "Image" : "Video"}
                            </button>
                          ))}
                        </div>

                        {mediaSelect === "image" && (
                          <ImageUpload
                            label={t("profileImage")}
                            value={reviewForm.imagePath}
                            onChange={(url: string) => setReviewForm({ ...reviewForm, imagePath: url })}
                            aspectRatio="aspect-square"
                            folder="about-us/google-reviews/images"
                            onUploading={setIsUploadingFile}
                          />
                        )}

                        {mediaSelect === "video" && (
                          <VideoUpload
                            label={t("reviewVideo")}
                            value={reviewForm.videoPath}
                            onChange={(url: string) => setReviewForm({ ...reviewForm, videoPath: url })}
                            aspectRatio="aspect-square"
                            folder="about-us/google-reviews/videos"
                            onUploading={setIsUploadingFile}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Live Preview */}
                  <div className="md:col-span-2 bg-gray-50/70 p-4 rounded-xl border border-gray-200 flex flex-col">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 pb-1 border-b border-gray-200">
                      {t("preview")}
                    </h4>

                    <div className="flex-1 flex items-center justify-center p-2">
                      {/* Simulated Testimonial Card */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                              {reviewForm.avatarPath ? (
                                <img src={getPublicUrl(reviewForm.avatarPath)} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                reviewForm.name ? reviewForm.name.charAt(0).toUpperCase() : "?"
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900 min-h-[20px]">
                                {reviewForm.name || "Customer Name"}
                              </p>
                              <p className="text-xs text-gray-500 min-h-[16px]">
                                {reviewForm.country || "Country"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            {reviewForm.rating}
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6 italic line-clamp-3 min-h-[60px]">
                          &ldquo;{reviewForm.comment || "Customer review comment will appear here..."}&rdquo;
                        </p>

                        {mediaSelect === "video" && reviewForm.videoPath ? (
                          <div className="relative w-full h-24 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-100">
                            <video
                              src={getPublicUrl(reviewForm.videoPath)}
                              className="object-cover w-full h-full"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium">
                              <Play className="w-4 h-4 mr-1.5 fill-white" />
                              Watch Review
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <Video size={20} className="mb-1 opacity-40" />
                            <span className="text-[10px]">No Video Added</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="blue" onClick={() => { setShowReviewForm(false); setEditReview(null); }} disabled={isSaving || isUploadingFile}>
                    {t("cancel")}
                  </Button>
                  <Button 
                    icon={<Check size={16} />} 
                    onClick={handleSaveReview}
                    isLoading={isSaving}
                    disabled={isUploadingFile}
                  >
                    {editReview ? t("update") : t("save")}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Reviews Table */}
          {isLoadingReviews ? (
            <div className="flex justify-center p-10">
              <p className="text-gray-500">{t("loadingReviews")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("avatar")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("name")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("country")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("rating")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("hasVideo")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("createdDate")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                        {t("noReviews")}
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.mediaType === "image" && review.mediaPath ? (
                            <img src={getPublicUrl(review.mediaPath)} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                              {review.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {review.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {review.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className={cn(
                                  s <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.mediaType === "video" && review.mediaPath ? (
                            <button
                              type="button"
                              onClick={() => setActiveVideoUrl(getPublicUrl(review.mediaPath))}
                              className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                            >
                              <Play size={10} className="fill-green-700" />
                              {t("yes")}
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                              {t("no")}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date((review as any).createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openReviewForm(review)}
                              className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title={t("update")}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: "review", id: review.id, name: review.name })}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm?.type === "tourist") handleDeleteTourist(deleteConfirm.id);
          if (deleteConfirm?.type === "review") handleDeleteReview(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title={deleteConfirm?.type === "tourist" ? t("deleteTitle", { type: "Tourist" }) : t("deleteTitle", { type: "Review" })}
        message={t("deleteConfirm", { name: deleteConfirm?.name || "" })}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!activeVideoUrl}
        onClose={() => setActiveVideoUrl(null)}
        videoUrl={activeVideoUrl || ""}
        title="Customer Video Review"
      />
    </DashboardLayout>
  );
}

export default function AboutUsManagement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutUsContent />
    </Suspense>
  );
}

