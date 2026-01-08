"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_id: string; // ✅ Add this
}

export default function Task({session}: {session: Session}) {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" }); // ✅ Keep as object
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [taskimage , setTaskimage] = useState<File | null>(null);
  // FETCH TASKS
  const fetchTasks = async () => {
    if (!session.user) return;
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("id", { ascending: true });

    if (!error) setTasks(data || []);
  };

  useEffect(() => {
    if (session.user) fetchTasks();
  }, [session.user]);

  // ✅ REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!session.user) return;

    const channel = supabase
      .channel("realtime:tasks")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${session.user.id}` // ✅ Only listen to current user's tasks
        },
        (payload) => {
          const insertedTask = payload.new as Task;
          // ✅ Only add if it's for current user
          if (insertedTask.user_id === session.user.id) {
            setTasks((prev) => [...prev, insertedTask]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          const updatedTask = payload.new as Task;
          setTasks((prev) =>
            prev.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          const deletedTask = payload.old as Task;
          setTasks((prev) => prev.filter((task) => task.id !== deletedTask.id));
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // ✅ Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.user]);

  // ADD TASK
  const uploadImage = async(file : File):Promise<string| null>=>{
    const filePath = `${file.name}-${Date.now()}`;
    const { error } = await supabase.storage
    .from('tasks_image')
    .upload(filePath , file);
    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    } 
    const {data} = supabase.storage.from('tasks_image').getPublicUrl(filePath)
    return data.publicUrl;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session.user) {
      alert("You must be logged in!");
      return;
    }
    let imageUrl: string | null = null;
    if (taskimage){
      imageUrl = await uploadImage(taskimage)
    }
    const { error} = await supabase
      .from("tasks")
      .insert({
        title: newTask.title,
        description: newTask.description,
        user_id: session.user.id,
        image_url: imageUrl
      })
      .select()
      .single();

    if (!error) {
      setNewTask({ title: "", description: "" });
    }
  };
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length>0){
    setTaskimage(e.target.files[0]);
  } };
  // OPEN EDIT MODAL
  const openEdit = (task: Task) => {
    setEditId(task.id);
    setNewDescription(task.description);
    setOpenModal(true);
  };

  // UPDATE TASK
  const editTask = async () => {
    if (!editId) return;

    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", editId);

    if (!error) {
      setOpenModal(false);
      setEditId(null);
      // ✅ Realtime will handle the update
    }
  };

  // DELETE TASK
  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    // ✅ Realtime will handle the deletion
  };

  if (!session.user) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* ADD TASK */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-3 border rounded"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          className="w-full mb-2 p-3 border rounded"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          required
        />
        <input type="file" name="" id="" accept="image/*" onChange={handleFileChange}/>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Task
        </button>
      </form>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border rounded-xl p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="font-bold text-lg">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
              </div>

              <div className="space-x-2 flex-shrink-0">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => openEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>
            <textarea
              className="w-full p-3 border rounded mb-4"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={4}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={editTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}