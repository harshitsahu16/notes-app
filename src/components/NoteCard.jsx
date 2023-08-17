import React, { useEffect, useRef, useState } from 'react';
import { AiFillDelete, AiFillEdit, AiFillPushpin, AiOutlinePushpin, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

function NoteCard({ note, updateNote, deleteNote, isNewlyAdded }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ ...note });
  const initialNoteRef = useRef(note);



  useEffect(() => {
    if (isNewlyAdded) {
      setIsEditing(true);
      setEditedNote({ ...initialNoteRef.current });
    }
  }, [isNewlyAdded]);
  

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedNote({ ...note });
  };


  const handleSaveEdit = () => {
    if (!editedNote.title || !editedNote.tagline) {
      toast.error("Title or Tagline cannot be empty!");
      return;
    }
  
    updateNote(note.id, editedNote);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    deleteNote(note.id);
  };

  const handlePinToggle = () => {
    const updatedNote = { ...editedNote, pinned: !editedNote.pinned };
    setEditedNote(updatedNote);
    updateNote(note.id, updatedNote);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden grid">
      <div className="bg-blue-200 flex items-center justify-center w-full text-blue-900 py-4 px-8 text-3xl font-semibold">
        {isEditing ? (
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
            placeholder='Enter the title'
            className='w-60'
          />
        ) : (
          <><span className='flex items-center p-1'>
              {editedNote.title}{' '}
            </span><span className='ml-2'>
                {editedNote.pinned ? <AiFillPushpin size={20} /> : null}
              </span></>
        )}
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-2xl mb-4 font-bold">
          {isEditing ? (
            <input
              className='w-full'
              type="text"
              value={editedNote.tagline}
              onChange={(e) => setEditedNote({ ...editedNote, tagline: e.target.value })}
              placeholder='Enter the tagline'
            />
          ) : (
            editedNote.tagline
          )}
        </p>
        <p className="text-black-800">
          {isEditing ? (
            <textarea
              className='w-full px-4'
              rows="4"
              value={editedNote.body}
              onChange={(e) => setEditedNote({ ...editedNote, body: e.target.value })}
              placeholder='Enter the body'
            />
          ) : (
            editedNote.body
          )}
        </p>
      </div>
      <div className="p-3 flex justify-end">
        {isEditing ? (
          <>
            <AiOutlineSave
              className="text-green-500 cursor-pointer hover:text-green-600 mr-2"
              onClick={handleSaveEdit}
              size={25}
            />
            <AiOutlineDelete
              className="text-red-500 cursor-pointer hover:text-red-600"
              onClick={handleDeleteClick}
              size={25}
            />
            <button
              className="text-blue-500 cursor-pointer hover:text-blue-600 mr-2"
              onClick={handlePinToggle} 
            >
              {editedNote.pinned ? (
                <AiFillPushpin size={25} />
              ) : (
                <AiOutlinePushpin size={25} />
              )}
            </button>
          </>
        ) : (
          <div className='flex items-center justify-center space-2'>
            <button
              className="text-blue-500 cursor-pointer hover:text-blue-600 mr-2"
              onClick={handleEditClick}
            >
              <AiFillEdit size={25} />
            </button>
            <button
              className="text-red-500 cursor-pointer hover:text-red-600 mr-2"
              onClick={handleDeleteClick}
            >
              <AiFillDelete size={25} />
            </button>
            {editedNote.pinned ? <AiFillPushpin color='black' size={25} /> : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
