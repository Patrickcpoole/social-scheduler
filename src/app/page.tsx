"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import CalendarView from "../components/CalendarView";
import PostForm from "../components/PostForm";

type PostType = {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  frequency?: "once" | "daily" | "weekly" | "biweekly" | "monthly";
};

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: "post-1",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      title: "Product Launch",
      content: "Introducing our new product line! #innovation",
      frequency: "once",
    },
    {
      id: "post-2",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
      title: "Weekly Tips",
      content: "Top 5 tips for better productivity. #productivity",
      frequency: "weekly",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddPost = (date: Date) => {
    setSelectedDate(date);
    setSelectedPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: PostType) => {
    setSelectedPost(post);
    setSelectedDate(null);
    setShowForm(true);
  };

  const handleSavePost = (post: PostType) => {
    if (selectedPost) {
      // Update existing post
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    } else {
      // Add new post
      setPosts([...posts, post]);
    }
    setShowForm(false);
    setSelectedPost(null);
    setSelectedDate(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedPost(null);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Social Media Scheduler
          </h1>
          <p className="mt-2 text-gray-600">
            Plan, create, and schedule your social media content with AI
            assistance
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Post Frequency Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md bg-indigo-50">
              <h3 className="font-medium text-indigo-700 mb-2">Daily Posts</h3>
              <p className="text-sm text-gray-600">
                Best for news, updates, and maintaining high engagement.
              </p>
            </div>
            <div className="p-4 border rounded-md bg-emerald-50">
              <h3 className="font-medium text-emerald-700 mb-2">
                Weekly Posts
              </h3>
              <p className="text-sm text-gray-600">
                Ideal for product features, tips, and deeper content.
              </p>
            </div>
            <div className="p-4 border rounded-md bg-amber-50">
              <h3 className="font-medium text-amber-700 mb-2">Monthly Posts</h3>
              <p className="text-sm text-gray-600">
                Good for major announcements and comprehensive content.
              </p>
            </div>
          </div>
        </div>

        <CalendarView
          posts={posts}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
        />

        {showForm && (
          <PostForm
            post={selectedPost || undefined}
            selectedDate={selectedDate || undefined}
            onSave={handleSavePost}
            onCancel={handleCancelForm}
          />
        )}

        <div className="mt-20 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="p-8 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Plan Your Content
              </h3>
              <p className="text-gray-600">
                Use the calendar to organize and schedule your content. Define
                post frequency and themes.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Create with AI
              </h3>
              <p className="text-gray-600">
                Generate captions, images, and videos using our AI-powered tools
                to enhance your content.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Schedule & Publish
              </h3>
              <p className="text-gray-600">
                Schedule your posts to be published automatically at the optimal
                times for engagement.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-24 border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Social Media Scheduler. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
