"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { defaultPipelineSettings, instagramSetupStatus } from "@/lib/cms/instagram-pipeline";
import type { PipelineSettings, PipelineTopic } from "@/lib/cms/types";

export function AdminPipelineManager() {
  const [settings, setSettings] = useState<PipelineSettings>(defaultPipelineSettings());
  const [topics, setTopics] = useState<PipelineTopic[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicBrief, setTopicBrief] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: settingsData }, { data: topicsData, error: topicsError }] = await Promise.all([
      supabase.from("story_pipeline_settings").select("*").eq("id", "global").maybeSingle(),
      supabase.from("story_pipeline_topics").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    if (settingsData) {
      setSettings({
        id: settingsData.id,
        enabled: settingsData.enabled,
        social_platforms: settingsData.social_platforms ?? ["instagram"],
        brand_voice: settingsData.brand_voice,
        instagram_handle: settingsData.instagram_handle,
        openai_model: settingsData.openai_model,
        auto_generate_instagram: settingsData.auto_generate_instagram,
      });
    }

    if (topicsError) {
      setError(topicsError.message);
      return;
    }
    setTopics((topicsData as PipelineTopic[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    const { error: updateError } = await supabase.from("story_pipeline_settings").upsert({
      id: "global",
      enabled: settings.enabled,
      social_platforms: settings.social_platforms,
      brand_voice: settings.brand_voice,
      instagram_handle: settings.instagram_handle,
      openai_model: settings.openai_model,
      auto_generate_instagram: settings.auto_generate_instagram,
    });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage("Pipeline settings saved.");
  }

  async function queueTopic(e: React.FormEvent) {
    e.preventDefault();
    const { error: insertError } = await supabase.from("story_pipeline_topics").insert({
      title: topicTitle.trim(),
      brief: topicBrief.trim() || null,
      status: "queued",
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTopicTitle("");
    setTopicBrief("");
    setMessage("Topic queued. Process manually for now — Instagram account setup pending.");
    await load();
  }

  const setup = instagramSetupStatus(settings);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-forest">Pipeline settings</h2>
        <p className="mt-2 text-driftwood text-sm">Instagram-first social pipeline (LinkedIn removed).</p>
      </div>

      {message ? <p className="text-sm text-forest">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="admin-card space-y-4">
        <p className="text-sm text-driftwood">{setup.message}</p>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings((s) => ({ ...s, enabled: e.target.checked }))}
          />
          Enable pipeline
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.auto_generate_instagram}
            onChange={(e) => setSettings((s) => ({ ...s, auto_generate_instagram: e.target.checked }))}
          />
          Auto-generate Instagram captions on publish
        </label>

        <div>
          <label className="text-sm font-medium">Instagram handle</label>
          <input
            className="admin-input mt-1"
            placeholder="@balticartisan"
            value={settings.instagram_handle ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, instagram_handle: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Brand voice</label>
          <textarea
            className="admin-input mt-1 min-h-[100px]"
            value={settings.brand_voice}
            onChange={(e) => setSettings((s) => ({ ...s, brand_voice: e.target.value }))}
          />
        </div>

        <button type="button" className="admin-btn-primary" onClick={() => void saveSettings()}>
          Save settings
        </button>
      </div>

      <form onSubmit={queueTopic} className="admin-card space-y-4">
        <h3 className="font-serif text-xl">Queue story topic</h3>
        <div>
          <label className="text-sm font-medium">Title</label>
          <input className="admin-input mt-1" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Brief</label>
          <textarea className="admin-input mt-1 min-h-[100px]" value={topicBrief} onChange={(e) => setTopicBrief(e.target.value)} />
        </div>
        <button type="submit" className="admin-btn-primary">Queue topic</button>
      </form>

      <div className="admin-card">
        <h3 className="font-serif text-xl mb-4">Recent topics</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td>{topic.title}</td>
                <td className="capitalize">{topic.status}</td>
                <td>{new Date(topic.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
