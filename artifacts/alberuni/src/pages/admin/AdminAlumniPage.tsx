import { useState } from "react";
import {
  useListAlumni,
  useCreateAlumni,
  useUpdateAlumni,
  useDeleteAlumni,
  getListAlumniQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Trophy } from "lucide-react";
import type { AlumniItem } from "@workspace/api-client-react";

type FormData = {
  name: string;
  graduationYear: string;
  achievement: string;
  currentPosition: string;
  bio: string;
  photo: string;
};

const empty: FormData = { name: "", graduationYear: "", achievement: "", currentPosition: "", bio: "", photo: "" };

export default function AdminAlumniPage() {
  const qc = useQueryClient();
  const { data: alumniList, isLoading } = useListAlumni({ query: { queryKey: getListAlumniQueryKey() } });
  const createMutation = useCreateAlumni();
  const updateMutation = useUpdateAlumni();
  const deleteMutation = useDeleteAlumni();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AlumniItem | null>(null);
  const [form, setForm] = useState<FormData>(empty);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListAlumniQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (a: AlumniItem) => {
    setEditing(a);
    setForm({
      name: a.name,
      graduationYear: String(a.graduationYear),
      achievement: a.achievement,
      currentPosition: a.currentPosition ?? "",
      bio: a.bio ?? "",
      photo: a.photo ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      graduationYear: Number(form.graduationYear),
      achievement: form.achievement,
      currentPosition: form.currentPosition || undefined,
      bio: form.bio || undefined,
      photo: form.photo || undefined,
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
          <h1 className="text-2xl font-bold text-gray-900">Faxrli Bitiruvchilar</h1>
          <p className="text-gray-500 text-sm mt-1">{alumniList?.length ?? 0} ta bitiruvchi</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse flex gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !alumniList?.length ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Hali bitiruvchi qo'shilmagan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alumniList.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl bg-amber-100 overflow-hidden shrink-0">
                {a.photo ? (
                  <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-amber-400">
                    {a.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{a.name}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{a.graduationYear}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.achievement}</p>
                {a.currentPosition && <p className="text-xs text-gray-400 mt-0.5">{a.currentPosition}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Bitiruvchini tahrirlash" : "Yangi bitiruvchi"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Ism*</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="To'liq ism" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Bitirgan yil*</label>
                <Input type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} required placeholder="2020" min="1990" max="2030" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Rasm URL</label>
                <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Yutuq*</label>
              <Input value={form.achievement} onChange={(e) => setForm({ ...form, achievement: e.target.value })} required placeholder="Asosiy yutuq..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Hozirgi lavozim</label>
              <Input value={form.currentPosition} onChange={(e) => setForm({ ...form, currentPosition: e.target.value })} placeholder="Hozir qayerda ishlaydi..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Bio</label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Qisqacha..." rows={3} />
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
