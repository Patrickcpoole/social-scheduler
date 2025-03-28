"use client";

import { useState } from "react";
import CalendarView from "../components/ui/CalendarView";
import PostForm from "../components/form/PostForm";

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: "post-1",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      referenceTitle: "Product Launch",
      caption: "Introducing our new product line! #innovation",
      frequency: "once",
      status: "published",
    },
    {
      id: "post-2",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
      frequencyRange: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        22
      ),
      referenceTitle: "Weekly Tips",
      caption: "Top 5 tips for better productivity. #productivity",
      frequency: "weekly",
      status: "published",
    },
    {
      id: "post-3",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 30),
      referenceTitle: "Product Launch",
      caption: "Introducing our new product line! #innovation",
      frequency: "once",
      status: "published",
    },
    {
      id: "post-4",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 31),
      referenceTitle: "Merch Drop",
      caption: "Get your new merch now! #merch",
      frequency: "once",
      status: "draft",
    },
    {
      id: "post-5",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 31),
      referenceTitle: "Monday Newsletter",
      caption: "The latest news and updates from our team. #newsletter",
      frequency: "once",
      status: "draft",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

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

  const handleDeletePost = (post: PostType) => {
    setPosts(posts.filter((p) => p.id !== post.id));
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedTab === "all") return true;
    return post.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <CalendarView
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          posts={filteredPosts}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
        />

        {showForm && (
          <PostForm
            post={selectedPost || undefined}
            selectedDate={selectedDate || undefined}
            onSave={handleSavePost}
            onCancel={handleCancelForm}
            onDelete={selectedPost ? handleDeletePost : undefined}
          />
        )}
      </main>
    </div>
  );
}
