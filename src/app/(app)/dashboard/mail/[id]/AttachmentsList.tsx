'use client';

import { useState, useRef } from 'react';
import { PiMicrosoftExcelLogoLight, PiMicrosoftWordLogoLight } from 'react-icons/pi';
import { GoFileZip } from 'react-icons/go';
import { FaRegFile } from 'react-icons/fa';
import { Modal } from '@/components/Modal';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

interface Attachment {
  filename: string;
  contentType: string;
}

interface ReplyAttachment {
  filename: string;
  url: string;
}

interface AttachmentsListProps {
  attachments?: Attachment[];
  replyAttachments?: ReplyAttachment[];
  mailId: string;
  title?: string;
  onAttachmentsChange?: (attachments: ReplyAttachment[]) => void;
  handleRegenerateFiles?: () => void;
  isRegenerateLoading?: boolean;
}

function getFileTypeIcon(extension: string) {
  switch (extension.toLowerCase()) {
    case 'doc':
    case 'docx':
      return <PiMicrosoftWordLogoLight />;
    case 'xls':
    case 'xlsx':
      return <PiMicrosoftExcelLogoLight />;
    case 'zip':
    case 'rar':
      return <GoFileZip />;
    default:
      return <FaRegFile />;
  }
}

export function AttachmentsList({
  attachments = [],
  replyAttachments = [],
  mailId,
  title = 'Attachments',
  onAttachmentsChange,
  handleRegenerateFiles,
  isRegenerateLoading = false
}: AttachmentsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ url: string; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = (
    fileUrl: string,
    filename: string,
    isReplyAttachment: boolean = false
  ) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') {
      const apiUrl = `/api/attachments/${mailId}/${filename}${isReplyAttachment ? '?type=response' : ''}`;
      setSelectedFile({ url: apiUrl, filename });
      setIsModalOpen(true);
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  const handleDownload = (e: React.MouseEvent, fileUrl: string, filename: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/attachments/${mailId}?filename=${filename}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const updatedAttachments = replyAttachments.filter((att) => att.filename !== filename);
      onAttachmentsChange?.(updatedAttachments);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls') {
      toast.error('Please upload only Excel files');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/attachments/${mailId}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      const newAttachment = {
        filename: data.filename,
        url: data.url
      };

      onAttachmentsChange?.([...replyAttachments, newAttachment]);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const renderAttachmentCard = (
    filename: string,
    fileUrl: string,
    contentType: string,
    isReplyAttachment: boolean = false
  ) => {
    const isImage = contentType.startsWith('image/');
    const extension = filename.split('.').pop() || '';
    const icon = getFileTypeIcon(extension);

    return (
      <div
        key={filename}
        onClick={() => handleFileClick(fileUrl, filename, isReplyAttachment)}
        className="flex flex-col items-center w-28 h-28 rounded-lg border border-gray-200 shadow hover:bg-gray-100 transition cursor-pointer p-2 group relative"
        title={filename}
      >
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            onClick={(e) => handleDownload(e, fileUrl, filename)}
            className="p-1 rounded-md bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title="Download"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
          {isReplyAttachment && (
            <button
              onClick={(e) => handleDelete(e, filename)}
              className="p-1 rounded-md bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          {isImage ? (
            <img src={fileUrl} alt={filename} className="object-cover w-12 h-12 rounded" />
          ) : (
            <div className="text-4xl">{icon}</div>
          )}
        </div>
        <div className="mt-2 w-full text-xs text-center truncate">{filename}</div>
      </div>
    );
  };

  const allAttachments = [
    ...attachments.map((att) => ({
      filename: att.filename,
      url: `/eml-attachments/${mailId}/${att.filename}`,
      contentType: att.contentType,
      isReplyAttachment: false
    })),
    ...replyAttachments.map((att) => ({
      filename: att.filename,
      url: att.url,
      contentType: att.filename.toLowerCase().endsWith('.xlsx')
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/octet-stream',
      isReplyAttachment: true
    }))
  ];

  return (
    <>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          {onAttachmentsChange && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button
                onClick={handleRegenerateFiles}
                disabled={isRegenerateLoading}
                variant="outline"
              >
                Regenerate Response Files
              </Button>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-4" /> Upload Excel
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          {allAttachments.map((att) =>
            renderAttachmentCard(att.filename, att.url, att.contentType, att.isReplyAttachment)
          )}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedFile?.filename}
        fileType="xlsx"
        fileUrl={selectedFile?.url}
      >
        {selectedFile && <div>Loading Excel file...</div>}
      </Modal>
    </>
  );
}
