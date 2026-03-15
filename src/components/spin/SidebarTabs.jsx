import React, { useRef, useEffect } from 'react';
import { ChatPanel } from './ChatPanel';
import { SparksPanel } from './SparksPanel';
import { PeoplePanel } from './PeoplePanel';

export const SidebarTabs = ({
  activeTab,
  setActiveTab,
  messages,
  sparks,
  onSendMessage,
  onOpenPurchase
}) => {
  const msgListRef = useRef(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (msgListRef.current && activeTab === 'chat') {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="sidebar">
      <div className="stabs">
        <div 
          className={`stab ${activeTab === 'chat' ? 'on' : ''}`}
          onClick={() => handleTabClick('chat')}
        >
          Chat
        </div>
        <div 
          className={`stab ${activeTab === 'sparks' ? 'on' : ''}`}
          onClick={() => handleTabClick('sparks')}
        >
          ⚡ Sparks
        </div>
        <div 
          className={`stab ${activeTab === 'people' ? 'on' : ''}`}
          onClick={() => handleTabClick('people')}
        >
          Online
        </div>
      </div>

      <div className={`tabc ${activeTab === 'chat' ? 'on' : ''}`} id="tabChat">
        <ChatPanel
          messages={messages}
          onSendMessage={onSendMessage}
          msgListRef={msgListRef}
        />
      </div>

      <div className={`tabc ${activeTab === 'sparks' ? 'on' : ''}`} id="tabSparks">
        <SparksPanel
          sparks={sparks}
          onOpenPurchase={onOpenPurchase}
        />
      </div>

      <div className={`tabc ${activeTab === 'people' ? 'on' : ''}`} id="tabPpl">
        <PeoplePanel />
      </div>
    </div>
  );
};
