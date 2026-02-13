import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { SkillNode } from "@/types/skill";
import { Markdown } from "@/Markdown/Markdown";
import MarkdownEditor from "@/Markdown/MarkdownEditor";
import { uploadNodeImage } from "@/lib/uploadImage";

type SkillPageProps = {
  node: SkillNode;
  path: string;
};

const SkillNodePage: React.FC<SkillPageProps> = ({ node }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [lastSaved, setLastSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setDraft(node.markdown_summary ?? "");
    setLastSaved(node.markdown_summary ?? "");
  }, [node.id, node.markdown_summary]);

  const dirty = useMemo(() => draft.trim() !== lastSaved.trim(), [draft, lastSaved]);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const { error } = await supabase
        .from("skill_nodes")
        .update({ markdown_summary: draft })
        .eq("id", node.id);

      if (error) throw error;

      setLastSaved(draft);
      setEditing(false);
    } catch (e: any) {
      setErr(e.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setDraft(lastSaved);
    setEditing(false);
  }

  const children = node.children ?? [];

  return (
    <div className="h-full w-full p-8 overflow-y-auto scrollbar-hide min-h-0" >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-6xl font-opensans font-extrabold">{node.name}</h1>

          {/* Children links (top) */}
        {children.length > 0 && (
          <div className="mt-6">
            {/* <div className="text-xl font-bold">
              Explore
            </div> */}

            <div className="mt-4 flex flex-wrap gap-4">
              {children.map((c) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}`}
                  title={c.name}
                  className="
                    inline-flex items-center gap-3
                    rounded-xl border-2 border-slate-200
                    px-5 py-3
                    text-base font-medium
                    hover:bg-sky-50
                    transition
                  "
                >
                  {c.logo && (
                    <img
                      src={c.logo}
                      alt=""
                      className="h-6 w-6 rounded-md"
                    />
                  )}
                  <span className="truncate max-w-[22rem]">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        </div>

        {/* Edit controls */}
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button
              className="px-3 py-1 rounded border"
              onClick={() => (editing ? cancel() : setEditing(true))}
            >
              {editing ? "Cancel" : "Edit"}
            </button>

            {editing && (
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={save}
                disabled={!dirty || saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            )}
          </div>
        )}
      </div>

      {err && <div className="mt-3 text-red-400">{err}</div>}

      {/* Markdown below */}
      <div className="mt-6 ">

        {editing ? (
          <MarkdownEditor
            value={draft}
            onChange={setDraft}
            onUploadImage={(file) => uploadNodeImage({ file, nodeSlug: node.slug })}
          />
        ) : (
          <Markdown content={draft} />
        )}
      </div>
    </div>
  );
};

export default SkillNodePage;
