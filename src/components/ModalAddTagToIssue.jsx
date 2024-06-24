import useTag from '../hooks/useTag';
import React, { useState, useEffect } from 'react';
import '../styles/ModalAddTagToIssue.css';
import PopUp from './PopUp';

const ModalAddTagToIssue = ({ show, onClose, issueId, actualsTags }) => {
    const { tags, addTagToIssue } = useTag();
    const [addedTags, setAddTags] = useState([]);    
    const [popup, setPopup] = useState({ status:'', show: false, message: '' });

    // Initialize addedTags with actualsTags when modal is shown
    useEffect(() => {
        if (show) {
            const tempTags = actualsTags.map(t => t.tagId);
            setAddTags(tempTags);
        }
    }, [show, actualsTags]);

    if (!show) {
        return null;
    }

    const handleTagClick = (tagId) => {
        let newAddedTags;        
        if (!addedTags.includes(tagId)) {
            newAddedTags = [...addedTags, tagId];
        } else {
            newAddedTags = addedTags.filter(item => item !== tagId);
        }
        setAddTags(newAddedTags);
        actualsTags = newAddedTags;
    };

    const handleClose = () => {
        const returnActualsTags = actualsTags;
        setAddTags(actualsTags || []); // Reset addedTags to actualsTags when closing without saving
        onClose(returnActualsTags);
    };

    const handleSaveTags = async () => {
        try {
            await addTagToIssue(addedTags, issueId);
            setPopup({ show: true, status:'success', message :'Tags modificados exitosamente.'})    

        } catch (error) {
            setPopup({ show: true, status:'error', message :'Error al modificar los tags.'})        
            console.error('Error adding tag:', error);               
        }
    };

    const closePopup = () => {
        setPopup({ show: false, status: '', message: '' });
      };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={handleClose}>X</button>
                <h3>Modificar Tags del issue</h3>
                <div className="modal-tags">
                    {tags?.map(tag => (
                        <div
                            key={tag.tagId}
                            className={`tag ${addedTags.includes(tag.tagId) ? 'selected' : ''}`}
                            onClick={() => handleTagClick(tag.tagId)}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
                <button className="search-button" onClick={handleSaveTags}>Guardar</button>
                <PopUp 
                    status={popup.status} 
                    message={popup.message} 
                    show={popup.show} 
                    onClose={closePopup}
                />
            </div>
        </div>
    );
};

export default ModalAddTagToIssue;
