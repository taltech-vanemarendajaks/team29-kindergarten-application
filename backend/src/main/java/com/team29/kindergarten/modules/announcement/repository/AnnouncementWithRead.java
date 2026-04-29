package com.team29.kindergarten.modules.announcement.repository;

import com.team29.kindergarten.modules.announcement.model.Announcement;

public interface AnnouncementWithRead {
    Announcement getAnnouncement();
    boolean getIsRead();
}
