import React, { useState } from 'react';
import { Farm } from '../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Syringe,
  Activity,
  Milk,
  Tag,
  Sparkles,
} from 'lucide-react';

export interface LivestockAnimal {
  id: string;
  tagNumber: string;
  name: string;
  type: string; // e.g. 'Friesian Dairy Cow', 'Dorper Sheep', 'Kienyeji Chicken'
  ageMonths: number;
  healthStatus: 'Optimal' | 'Under Observation' | 'Requires Vaccination' | 'Sick / Quarantined';
  lastVaccinationDate: string;
  dailyYield?: string; // e.g. '18 Liters/day'
  notes?: string;
}

interface LivestockManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFarm: Farm;
  onUpdateFarm: (updated: Partial<Farm>) => void;
}

export const LivestockManagerModal: React.FC<LivestockManagerModalProps> = ({
  isOpen,
  onClose,
  activeFarm,
  onUpdateFarm,
}) => {
  const [animals, setAnimals] = useState<LivestockAnimal[]>([
    {
      id: 'anim-1',
      tagNumber: 'KE-UG-01',
      name: 'Chebet (Friesian)',
      type: 'Dairy Cow',
      ageMonths: 36,
      healthStatus: 'Optimal',
      lastVaccinationDate: '2026-06-12',
      dailyYield: '22 Liters',
      notes: 'High milk producer, dewormed last month.',
    },
    {
      id: 'anim-2',
      tagNumber: 'KE-UG-02',
      name: 'Baraka (Ayrshire)',
      type: 'Dairy Cow',
      ageMonths: 28,
      healthStatus: 'Requires Vaccination',
      lastVaccinationDate: '2025-11-20',
      dailyYield: '17 Liters',
      notes: 'East Coast Fever vaccine booster due.',
    },
    {
      id: 'anim-3',
      tagNumber: 'KE-UG-03',
      name: 'Flock #1 (15 Sheep)',
      type: 'Dorper Sheep',
      ageMonths: 14,
      healthStatus: 'Optimal',
      lastVaccinationDate: '2026-04-05',
      notes: 'Grazing in North Paddock.',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Friesian Dairy Cow');
  const [ageMonths, setAgeMonths] = useState(24);
  const [healthStatus, setHealthStatus] = useState<LivestockAnimal['healthStatus']>('Optimal');
  const [lastVaccinationDate, setLastVaccinationDate] = useState('2026-07-01');
  const [dailyYield, setDailyYield] = useState('18 Liters');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber || !name) return;

    const newAnimal: LivestockAnimal = {
      id: `anim-${Date.now()}`,
      tagNumber,
      name,
      type,
      ageMonths,
      healthStatus,
      lastVaccinationDate,
      dailyYield,
      notes,
    };

    const updatedList = [newAnimal, ...animals];
    setAnimals(updatedList);
    onUpdateFarm({
      headCount: updatedList.length,
      livestockType: type,
    });

    // Reset Form
    setTagNumber('');
    setName('');
    setShowAddForm(false);
  };

  const handleDeleteAnimal = (id: string) => {
    const updatedList = animals.filter((a) => a.id !== id);
    setAnimals(updatedList);
    onUpdateFarm({
      headCount: updatedList.length,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-stone-100 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">
                Livestock & Herd Health Management
              </h3>
              <p className="text-xs text-stone-400">
                Farm: <strong className="text-emerald-400">{activeFarm.name}</strong> • Total Herd: {animals.length} Animals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trigger Add Animal */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-stone-300">
            Registered Animal Tag Directory & Vaccination Logs
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center space-x-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Register New Animal Tag'}</span>
          </button>
        </div>

        {/* Add Animal Form */}
        {showAddForm && (
          <form onSubmit={handleAddAnimal} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
            <div className="font-bold text-amber-400 uppercase text-[10px] tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Animal Record Entry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Ear Tag / ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KE-UG-04"
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Animal Name / Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wanjiku (Guernsey)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Breed / Type</label>
                <input
                  type="text"
                  placeholder="e.g. Friesian Cross"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Age (Months)</label>
                <input
                  type="number"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(parseInt(e.target.value) || 12)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Health Status</label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-bold"
                >
                  <option value="Optimal">Optimal Health</option>
                  <option value="Under Observation">Under Observation</option>
                  <option value="Requires Vaccination">Requires Vaccination</option>
                  <option value="Sick / Quarantined">Sick / Quarantined</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Daily Yield (Milk/Eggs)</label>
                <input
                  type="text"
                  placeholder="e.g. 20 Liters"
                  value={dailyYield}
                  onChange={(e) => setDailyYield(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-bold text-amber-300"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-md"
              >
                Save Animal Record
              </button>
            </div>
          </form>
        )}

        {/* Animal Roster Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3">Ear Tag & Name</th>
                <th className="p-3">Type & Age</th>
                <th className="p-3">Health Status</th>
                <th className="p-3">Yield</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850 font-medium text-stone-200">
              {animals.map((a) => (
                <tr key={a.id} className="hover:bg-stone-850/60 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-stone-100 flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                        {a.tagNumber}
                      </span>
                      <span>{a.name}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div>{a.type}</div>
                    <div className="text-[10px] text-stone-400">{a.ageMonths} months old</div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        a.healthStatus === 'Optimal'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : a.healthStatus === 'Requires Vaccination'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {a.healthStatus}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-amber-300">{a.dailyYield || 'N/A'}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteAnimal(a.id)}
                      className="p-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800"
                      title="Remove Animal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
