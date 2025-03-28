"use client";

import { useState } from "react";
import CalendarView from "../components/ui/CalendarView";
import PostForm from "../components/form/PostForm";

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
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    } else {
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
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
}
