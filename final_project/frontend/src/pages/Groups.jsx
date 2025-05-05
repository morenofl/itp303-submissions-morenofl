import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/UserContext';
import Navbar from '../components/Navbar';
import Group from '../components/Group';
import './Groups.css';
import CreateGroup from '../components/CreateGroup';
import Confirm from '../components/Confirm';

export default function GroupsPage() {
  const { isLoggedIn, email: currentUserEmail, user_id, userGroups, setUserGroups } = useContext(UserContext);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const res = await fetch(`https://final-project-ro9j.onrender.com/api/userGroups`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch user groups');
        const data = await res.json();
        
        setUserGroups(data || []);
        
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && currentUserEmail) {
      fetchUserGroups();
    }
  }, [isLoggedIn, currentUserEmail]);

  const handleCreateClick = () => setShowCreatePopup(true);
  const cancelCreate = () => setShowCreatePopup(false);

  const handleRequestDelete = (groupId) => setGroupToDelete(groupId);
  const cancelDeleteGroup = () => setGroupToDelete(null);

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      await fetch(`https://final-project-ro9j.onrender.com/api/groups/${groupToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setUserGroups(prev => prev.filter(group => group.group_id != groupToDelete));
      
    } catch (err) {
      console.error('Failed to delete group:', err);
    } finally {
      setGroupToDelete(null);
    }
  };

  const handleEditGroup = async (originalName, updatedGroup) => {
    try {
      const groupToUpdate = userGroups.find(g => g.name === originalName);
      if (!groupToUpdate) {
        console.error("Original group not found.");
        return;
      }
  
      const response = await fetch(`https://final-project-ro9j.onrender.com/api/groups/${groupToUpdate.group_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedGroup)
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Failed to update group:', result);
        return;
      }
  
      // Update frontend state only if backend update succeeds
      setUserGroups(prev =>
        prev.map(group =>
          group.group_id === groupToUpdate.group_id
            ? { ...group, ...updatedGroup }
            : group
        )
      );
      setEditingGroup(null);
    } catch (err) {
      console.error('Error updating group:', err);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="search-page-body">
        <div className="left-column">
          <h2 className="search-title">My Groups</h2>

          {isLoggedIn ? (
            <>
              {loading ? (
                <div className='groupPageMessage'>
                  Loading your groups...
                </div>
                
              ) : (
                <ul className="group-list">
                  {userGroups.length > 0 ? (
                    userGroups.map((group, index) => (
                      <Group
                        key={group.group_id || index}
                        name={group.name}
                        group={group}
                        onDeleteRequest={() => handleRequestDelete(group.group_id)}
                        onEditSubmit={handleEditGroup}
                        onEditRequest={(g) => setEditingGroup(g)} 
                        showAdminButtons={user_id == group.created_by}
                      />
                    ))
                  ) : (
                    <div className="groupPageMessage">
                      Use the Search Page to join study groups! Or create a group below!
                    </div>
                  )}
                </ul>
              )}

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="pinkButton" onClick={handleCreateClick}>Create Group</button>
              </div>
            </>
          ) : (
            <div className="groupPageMessage">Please log in to view your groups.</div>
          )}

          {showCreatePopup && (
            <CreateGroup
              onSubmit={(newGroup) => {
                setUserGroups(prev => [...prev, newGroup]);
                setShowCreatePopup(false);
              }}
              onCancel={cancelCreate}
            />
          )}

          {groupToDelete && (
            <Confirm
              message={`Are you sure you want to delete this group?`}
              onConfirm={confirmDeleteGroup}
              onCancel={cancelDeleteGroup}
              confirmLabel="Yes, Delete"
              cancelLabel="Cancel"
            />
          )}

          {editingGroup && (
            <CreateGroup
              isEdit={true}
              initialValues={{
                name: editingGroup.name,
                ...editingGroup
              }}
              onSubmit={(updatedData) => handleEditGroup(editingGroup.name, updatedData)}
              onCancel={() => setEditingGroup(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
