import moment from "moment";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/constants";

type NoteHeaderProps = {
  title: string;
  setTitle: (title: string) => void;
  categories?: {
    authorId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
  }[];
  lastUpdated?: string;
  created?: string;
  id: number;
  triggerRender: () => void;
  // onDelete: (noteId: string) => void;
};

export default function NoteHeader({
  title,
  setTitle,
  categories,
  lastUpdated,
  id,
  triggerRender,
  created,
}: NoteHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [newCategory, setNewCategory] = useState<string>();
  const fetchCategories = async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
    }
    const result = await res.json();
    setFetchedCategories(result);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const postCategory = async (catId: number, noteId: number) => {
    const res = await fetch(`${BACKEND_URL}/api/v1/category/${noteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ categoryId: Number(catId) }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
    }
    const result = await res.json();
    console.log(result);
    triggerRender();
  };

  const deleteCategory = async (catId: number, noteId?: number) => {
    const res = await fetch(`${BACKEND_URL}/api/v1/category/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ categoryId: Number(catId) }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
    }
    const result = await res.json();
    console.log("SUCCESS IN DELETEION", result);
  };
  const addCategory = () => {
    console.log(selectedCategory);
    postCategory(selectedCategory, id);
  };

  const removeCategory = (catId: number) => {
    deleteCategory(catId, id);
    triggerRender();
    console.log("trigger");
  };

  const postNewCategory = async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });
    if (!res.ok) {
      const erorrData = await res.json();
    }
    const result = await res.json();
    console.log(result);
    fetchCategories();
    setNewCategory("");
  };
  return (
    <div className="border-b border-zinc-800">
      {/* Title */}
      <div className="p-8 pb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            className="text-4xl font-bold bg-transparent border-none outline-none w-full"
            autoFocus
          />
        ) : (
          <h1
            className="text-4xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 border-t border-zinc-800">
        {/* Categories */}
        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories &&
              categories?.map((category, index) => (
                <span
                  key={index}
                  id="badge-dismiss-default"
                  className={`inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-sm dark:bg-blue-900 dark:text-blue-300 $`}
                >
                  {category.name}
                  <button
                    type="button"
                    className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-xs hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                    data-dismiss-target="#badge-dismiss-default"
                    aria-label="Remove"
                  >
                    <svg
                      className="w-2 h-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                      onClick={() => removeCategory(category.id)}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Remove badge</span>
                  </button>
                </span>
              ))}
          </div>
          <div></div>
        </div>

        {/* Last Updated */}
        <div className="p-4">
          <div className="text-sm font-medium mb-2">Last Updated</div>
          <div>{moment(lastUpdated).fromNow()}</div>
        </div>
      </div>

      {/* Created */}
      <div className="grid grid-cols-2 border-t border-zinc-800">
        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Created</div>
          <div>{moment(created).fromNow()}</div>
        </div>

        {/* Extra */}
        <div className="p-4">
          <div className="text-sm font-medium mb-2 flex flex-col gap-5">
            Add Categories
            <form
              className="min-w-sm mx-auto flex flex-row gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only">Underline select</label>

              <select
                id="underline_select"
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
              >
                {fetchedCategories &&
                  fetchedCategories.map((category: any, index: number) => (
                    <option key={index} id={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <button onClick={addCategory} type="submit">
                Add
              </button>
            </form>
            <form
              className="min-w-sm mx-auto flex flex-row gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Enter new category"
                className="w-full"
                onChange={(e) => setNewCategory(e.target.value)}
                value={newCategory}
              />
              <button onClick={postNewCategory} type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
