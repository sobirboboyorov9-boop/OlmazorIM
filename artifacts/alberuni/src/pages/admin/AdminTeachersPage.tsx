import { useState } from "react";
import {
  useListTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  getListTeachersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import type { Teacher } from "@workspace/api-client-react";

type FormData = {
  name: string;
  subject: string;
  experience: string;
  bio: string;
  photo: string;
  phone: string;
  email: string;
};

const empty: FormData = { name: "", subject: "", experience: "", bio: "", photo: "", phone: "", email: "" };

export default function AdminTeachersPage() {
  const qc = useQueryClient();
  const { data: teachers, isLoading } = useListTeachers({ query: { queryKey: getListTeachersQueryKey() } });
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState<FormData>(empty);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListTeachersQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({
      name: t.name,
      subject: t.subject,
      experience: String(t.experience),
      bio: t.bio ?? "",
      photo: t.photo ?? "",
      phone: t.phone ?? "",
      email: t.email ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      subject: form.subject,
      experience: Number(form.experience) || 0,
      bio: form.bio || undefined,
      photo: form.photo || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
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
          <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar</h1>
          <p className="text-gray-500 text-sm mt-1">{teachers?.length ?? 0} ta o'qituvchi</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !teachers?.length ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Hali o'qituvchi qo'shilmagan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl bg-blue-100 overflow-hidden shrink-0">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-blue-400">
                    {t.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{t.name}</h3>
                <p className="text-xs text-blue-600 mt-0.5">{t.subject}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.experience} yil tajriba</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(t.id)}>
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
            <DialogTitle>{editing ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Ism*</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="To'liq ism" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Fan*</label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="O'qitiladigan fan" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tajriba (yil)</label>
                <Input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="0" min="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Telefon</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Rasm URL</label>
                <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Bio</label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Qisqacha ma'lumot..." rows={3} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Bekor
              </Button>
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
