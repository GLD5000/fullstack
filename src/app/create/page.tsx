"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Draft: React.FC = () => {
  const Router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/post/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      Router.push("/drafts/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div>
        <form
          onSubmit={submitData}
          className="flex w-full max-w-body mx-auto gap-2 flex-col"
        >
          <h1 className="text-black dark:text-white">New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="bg-bg-var dark:bg-bg-var-dk rounded p-2"
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
            className="bg-bg-var dark:bg-bg-var-dk rounded p-2"
          />
          <div className="flex gap-2 ml-auto flex-row flex-wrap">

          <input disabled={!content || !title} type="submit" value="Create" className="rounded border-2 text-center flex  items-center justify-center h-10 my-auto w-28 hover:transition border-black text-black dark:text-white p-1 hover:text-white hover:bg-black dark:border-white dark:hover:text-black dark:hover:bg-white"/>
          <a className="rounded border-2 text-center flex  items-center justify-center h-10 my-auto w-28 hover:transition border-black text-black dark:text-white p-1 hover:text-white hover:bg-black dark:border-white dark:hover:text-black dark:hover:bg-white" href="#" onClick={() => Router.push("/")}>
            Cancel
          </a>
          </div>
        </form>
      </div>
  );
};

export default Draft;