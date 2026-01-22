import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SkillNode } from "@/types/skill";
import { Markdown } from "@/components/Markdown";
import MarkdownEditor from "@/components/MarkdownEditor";
import { uploadNodeImage } from "@/lib/Markdown/uploadImage";

type SkillPageProps = {
  node: SkillNode;
  path: string;
  isAdmin?: boolean;
};

const SkillNodePage: React.FC<SkillPageProps> = ({ node, isAdmin = true }) => {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState("");
	const [lastSaved, setLastSaved] = useState("");
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState<string | null>(null);
  
	useEffect(() => {
		console.log("NODE id/slug:", node.id, node.slug);
		console.log("NODE markdown_summary:", node.markdown_summary);
		setDraft(node.markdown_summary ?? "");
		setLastSaved(node.markdown_summary ?? "");
	  }, [node.id]);
  
	const dirty = useMemo(
	  () => draft.trim() !== lastSaved.trim(),
	  [draft, lastSaved]
	);
  
	async function save() {
	  setSaving(true);
	  setErr(null);
	  try {
		const { error } = await supabase
		  .from("skill_nodes")
		  .update({ markdown_summary: draft })
		  .eq("id", node.id);
  
		if (error) throw error;
  
		setLastSaved(draft);   // <-- THIS is the key
		setEditing(false);
	  } catch (e: any) {
		setErr(e.message ?? "Failed to save.");
	  } finally {
		setSaving(false);
	  }
	}
  
	function cancel() {
	  setDraft(lastSaved); // revert to last saved
	  setEditing(false);
	}
  return (
    <div className="h-full w-full p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold">{node.name}</h1>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border"
              onClick={() => setEditing((v) => !v)}
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

      <div className="mt-6">
        {editing ? (
          <MarkdownEditor
            value={draft}
            onChange={setDraft}
            onUploadImage={(file) => uploadNodeImage({ file, nodeSlug: node.slug })}
          />
        ) : (
          <div className="max-w-3xl">
            <Markdown content={draft} />


			
          </div>


        )}
      </div>
    </div>
  );
};

export default SkillNodePage;
