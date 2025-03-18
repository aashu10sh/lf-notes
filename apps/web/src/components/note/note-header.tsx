import moment from "moment";
import { useEffect, useState } from "react";
import CategoryController, { Category } from "../../lib/category/controller";
import toast from "react-hot-toast";

type NoteHeaderProps = {
  title: string;
  setTitle: (title: string) => void;
  categories?: Category[];
  lastUpdated?: string;
  created?: string;
  id: number;
  triggerRender: () => void;
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
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState({
    fetchCategories: false,
    addCategory: false,
    removeCategory: false,
    createCategory: false,
  });

  const categoryController = new CategoryController();

  const fetchCategories = async () => {
    setIsLoading((prev) => ({ ...prev, fetchCategories: true }));
    try {
      const result = await categoryController.getCategories();
      result.match(
        (categories) => setFetchedCategories(categories),
        (error) => toast.error(error.message),
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, fetchCategories: false }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setIsLoading((prev) => ({ ...prev, addCategory: true }));
    try {
      const result = await categoryController.addCategoryToNote(
        Number(selectedCategory),
        id,
      );
      result.match(
        () => {
          triggerRender();
          setSelectedCategory("");
          toast.success("Category added successfully");
        },
        (error) => toast.error(error.message),
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, addCategory: false }));
    }
  };

  const removeCategory = async (catId: number) => {
    setIsLoading((prev) => ({ ...prev, removeCategory: true }));
    try {
      const result = await categoryController.removeCategoryFromNote(catId, id);
      result.match(
        () => {
          triggerRender();
          toast.success("Category removed successfully");
        },
        (error) => toast.error(error.message),
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, removeCategory: false }));
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsLoading((prev) => ({ ...prev, createCategory: true }));
    try {
      const result = await categoryController.createCategory(
        newCategory.trim(),
      );
      result.match(
        async () => {
          await fetchCategories();
          setNewCategory("");
          toast.success("Category created successfully");
        },
        (error) => toast.error(error.message),
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, createCategory: false }));
    }
  };

  return (
    <div className="border-b border-zinc-800">

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


      <div className="grid grid-cols-2 border-t border-zinc-800">

        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category, index) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-sm dark:bg-blue-900 dark:text-blue-300"
              >
                {category.name}
                <button
                  type="button"
                  className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-xs hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                  aria-label="Remove"
                  disabled={isLoading.removeCategory}
                  onClick={() => removeCategory(category.id)}
                >
                  <svg
                    className="w-2 h-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Remove category</span>
                </button>
              </span>
            ))}
          </div>
        </div>


        <div className="p-4">
          <div className="text-sm font-medium mb-2">Last Updated</div>
          <div>{moment(lastUpdated).fromNow()}</div>
        </div>
      </div>


      <div className="grid grid-cols-2 border-t border-zinc-800">
        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Created</div>
          <div>{moment(created).fromNow()}</div>
        </div>


        <div className="p-4">
          <div className="text-sm font-medium mb-2 flex flex-col gap-5">
            Add Categories
            <form
              className="min-w-sm mx-auto flex flex-row gap-5"
              onSubmit={addCategory}
            >
              <label className="sr-only">Select category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                disabled={isLoading.addCategory || isLoading.fetchCategories}
              >
                <option value="">Select a category</option>
                {fetchedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!selectedCategory || isLoading.addCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                {isLoading.addCategory ? "Adding..." : "Add"}
              </button>
            </form>
            <form
              className="min-w-sm mx-auto flex flex-row gap-5"
              onSubmit={createCategory}
            >
              <input
                type="text"
                placeholder="Enter new category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setNewCategory(e.target.value)}
                value={newCategory}
                disabled={isLoading.createCategory}
              />
              <button
                type="submit"
                disabled={!newCategory.trim() || isLoading.createCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                {isLoading.createCategory ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
