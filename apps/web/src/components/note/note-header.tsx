import moment from "moment";
import { useEffect, useState } from "react";
import CategoryController, { Category } from "../../lib/category/controller";

type NoteHeaderProps = {
  title: string;
  setTitle: (title: string) => void;
  categories?: Category[];
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
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [newCategory, setNewCategory] = useState<string>("");
  const categoryController = new CategoryController();

  const fetchCategories = async () => {
    const result = await categoryController.getCategories();
    if (result.isOk()) {
      setFetchedCategories(result.value);
    } else {
      console.error(result.error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!selectedCategory) return;
    
    const result = await categoryController.addCategoryToNote(Number(selectedCategory), id);
    if (result.isOk()) {
      triggerRender();
    } else {
      console.error(result.error);
    }
  };

  const removeCategory = async (catId: number) => {
    const result = await categoryController.removeCategoryFromNote(catId, id);
    if (result.isOk()) {
      triggerRender();
    } else {
      console.error(result.error);
    }
  };

  const postNewCategory = async () => {
    if (!newCategory) return;
    
    const result = await categoryController.createCategory(newCategory);
    if (result.isOk()) {
      await fetchCategories();
      setNewCategory("");
    } else {
      console.error(result.error);
    }
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
              categories.map((category, index) => (
                <span
                  key={index}
                  id="badge-dismiss-default"
                  className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-sm dark:bg-blue-900 dark:text-blue-300"
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
                <option value="">Select a category</option>
                {fetchedCategories.map((category, index) => (
                  <option key={index} value={category.id}>
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
