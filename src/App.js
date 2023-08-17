import { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard';
import { db } from './firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { AiOutlinePlus } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { Pagination } from 'flowbite-react';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newlyAddedNoteId, setNewlyAddedNoteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousNoteEmpty, setPreviousNoteEmpty] = useState(false);


  const itemsPerPage = 6;

  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const fetchedNotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const notesToShow = notes.slice(startIndex, endIndex);

  const addNote = async (noteData) => {
    try {
      if (previousNoteEmpty) {
        toast.error("Previous note is empty. Please fill it before adding another note.");
        return; // Exit the function without adding a new note
      }
      const docRef = await addDoc(collection(db, 'notes'), { ...noteData, pinned: false });
      console.log("Note added successfully!");
      fetchNotes();
      setNewlyAddedNoteId(docRef.id);

      toast.success("Note added successfully!"); 
    } catch (error) {
      console.error("Error adding note: ", error);
      toast.error("Error adding note"); 
    }
  };

  useEffect(() => {
    // Check if the previous note is empty
    if (notes.length > 0) {
      const previousNote = notes[notes.length - 1];
      const isEmpty = !previousNote.title && !previousNote.tagline && !previousNote.body;
      setPreviousNoteEmpty(isEmpty);
    }
  }, [notes]);

  const updateNote = async (noteId, updatedData) => {
    if (!updatedData.title || !updatedData.tagline) {
      toast.error("Title or Tagline cannot be empty!");
      return;
    }
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, updatedData);
      console.log("Note updated successfully!");
      fetchNotes();

      toast.success("Note updated successfully!"); 
    } catch (error) {
      console.error("Error updating note: ", error);
      toast.error("Error updating note"); 
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);
      console.log("Note deleted successfully!");
      toast.success("Note deleted successfully!");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note: ", error);
      toast.error("Error deleting note"); 
    }
  };
  
  

  return (
    <div className="min-h-screen bg-transparent">
      <header className="bg-blue-500 text-white p-4 h-15">
        <h1 className="text-3xl flex items-start justify-start font-sans font-semibold">Notekeeper App</h1>
      </header>

      <main className="p-8">
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={true} />
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notesToShow
          .sort((a, b) => (b.pinned ? 1 : a.pinned ? -1 : 0))
          .map(note => (
            <NoteCard
              key={note.id}
              note={note}
              updateNote={updateNote}
              deleteNote={deleteNote}
              isNewlyAdded={newlyAddedNoteId === note.id}
            />
          ))}
        </section>
      </main>
      
      <div className='flex items-center justify-center hover:cursor-pointer'>
        <div className='bg-blue-600 flex items-center rounded-lg p-1'>
          <button
            className=" text-white text-1xl p-1"
            onClick={() => addNote({ title: '', tagline: '', body: '' })}
          >
            Add Note
          </button>
          <AiOutlinePlus color='white' size={20} />
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
          <Pagination 
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={Math.ceil(notes.length / itemsPerPage)}
          />
        </div>
    </div>
  );
}

export default App;
