import { useState } from "react";
import {
  useListClassrooms,
  useCreateClassroom,
  useUpdateClassroom,
  useDeleteClassroom,
  getListClassroomsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, School } from "lucide-react";
import type { ClassroomItem } from "@workspace/api-client-react";

type FormData = {
  name: string;
  description: string;
  imageUrl: string;
  capacity: string;
};

const empty: FormData = { name: "", description: "", imageUrl: "", capacity: "" };

export default function AdminClassroomsPage() {
  const qc = useQueryClient();
  const { data: classrooms, isLoading } = useListClassrooms({ query: { queryKey: getListClassroomsQueryKey() } });
  const createMutation = useCreateClassroom();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClassroomItem | null>(null);
  const [form, setForm] = useState<FormData>(empty);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListClassroomsQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (c: ClassroomItem) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description ?? "",
      imageUrl: c.imageUrl,
      capacity: c.capacity ? String(c.capacity) : "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      imageUrl: form.imageUrl,
      capacity: form.capacity ? Number(form.capacity) : undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: () => { invalidate(); setModalOpen(false); } });
    } else {
      createMutation.mutate({ data: payload }, { onSuccess: () => { invalidate(); setModalOpen(false); } });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    deleteMutation.mutate({ id }, { onSuccess: invalidate });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dars Xonalari</h1>
          <p className="text-gray-500 text-sm mt-1">{classrooms?.length ?? 0} ta xona</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !classrooms?.length ? (
        <div className="text-center py-16 text-gray-400">
          <School className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Hali dars xona qo'shilmagan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((c) => (
            <div key={c.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-40">
                <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                {c.capacity && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    {c.capacity} o'rin
                  </div>
                )}
              </div>
              <div className="p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{c.name}</h3>
                  {c.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{c.description}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Xonani tahrirlash" : "Yangi dars xona"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Xona nomi*</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Masalan: Kimyo laboratoriyasi" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Rasm URL*</label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">O'rin soni</label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="30" min="1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Tavsif</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Xona haqida..." rows={3} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Bekor</Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? "Saqlash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
