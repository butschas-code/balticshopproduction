"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { StoryCategory } from "@/lib/cms/types";

export function AdminCategoriesManager() {
  const [categories, setCategories] = useState<StoryCategory[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("story_categories").select("*").order("name");
    if (queryError) {
      setError(queryError.message);
      return;
    }
    setCategories((data as StoryCategory[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    const { error: insertError } = await supabase.from("story_categories").insert({
      name: name.trim(),
      slug: slug.trim(),
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setSlug("");
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-forest">Categories</h2>
        <p className="mt-2 text-driftwood text-sm">Group stories by theme.</p>
      </div>

      <form onSubmit={createCategory} className="admin-card grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className="admin-input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <input className="admin-input mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <button type="submit" className="admin-btn-primary">Add category</button>
      </form>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
