import { useState, useEffect } from 'react';
import SubjectCard from '../components/SubjectCard';
import { motion } from 'framer-motion';
import api from '../api';
import { NoteListResponse } from '../types';

const NotesPage = () => {
  const [notes, setNotes] = useState<NoteListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes/');
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Explore Our Notes Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated subject notes designed to help you achieve academic excellence.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading notes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <SubjectCard subject={note} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;