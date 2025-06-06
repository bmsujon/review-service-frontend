import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { REVIEW_TYPES, EMPLOYMENT_STATUS } from '../../constants';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Strikethrough,
  Quote,
  Code,
  Undo,
  Redo,
} from 'lucide-react';
import type { ReviewType, EmploymentStatus } from '../../constants';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface ValidationErrors {
  companyName?: string;
  title?: string;
  content?: string;
  reviewType?: string;
  isEmployee?: string;
  dept?: string;
  role?: string;
  website?: string;
  reviewerName?: string;
  employmentStatus?: string;
  workStartDate?: string;
  workEndDate?: string;
}

const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 100;
const MIN_CONTENT_LENGTH = 50;
const MAX_CONTENT_LENGTH = 5000;

const SubmitReview = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviewType, setReviewType] = useState<ReviewType>(REVIEW_TYPES.MIXED);
  const [isEmployee, setIsEmployee] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>(EMPLOYMENT_STATUS.CURRENT);
  const [workStartDate, setWorkStartDate] = useState('');
  const [workEndDate, setWorkEndDate] = useState('');
  const [dept, setDept] = useState('');
  const [role, setRole] = useState('');
  const [shareName, setShareName] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const queryClient = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () => {
      // Convert dates to ISO 8601 format with time
      const formatDate = (dateStr: string) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0); // Set time to start of day
        return date.toISOString();
      };

      return reviewService.createReview({
        reviewType,
        title,
        content: content,
        ipAddress: '127.0.0.1', // This should be handled by the backend
        companyName,
        website,
        isEmployee,
        dept: isEmployee ? dept : undefined,
        role: isEmployee ? role : undefined,
        reviewerName: shareName ? reviewerName : 'Anonymous',
        workStartDate: isEmployee ? formatDate(workStartDate) : undefined,
        workEndDate: isEmployee && employmentStatus === EMPLOYMENT_STATUS.FORMER ? formatDate(workEndDate) : undefined,
      });
    },
    onSuccess: () => {
      // Invalidate both recentReviews and stats queries
      queryClient.invalidateQueries({ queryKey: ['recentReviews'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Review submitted successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error('Failed to submit review');
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4 prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-sm',
      },
    },
    autofocus: true,
  });

  // Remove the focus effect since we're using autofocus
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const validateStep = () => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (!companyName.trim()) {
        newErrors.companyName = 'Please enter a company name';
      }
      if (!title.trim()) {
        newErrors.title = 'Title is required';
      } else if (title.length < MIN_TITLE_LENGTH) {
        newErrors.title = `Title must be at least ${MIN_TITLE_LENGTH} characters long`;
      } else if (title.length > MAX_TITLE_LENGTH) {
        newErrors.title = `Title must not exceed ${MAX_TITLE_LENGTH} characters`;
      }
    }

    if (step === 2) {
      if (shareName && !reviewerName.trim()) {
        newErrors.reviewerName = 'Please enter your name';
      }
      if (isEmployee) {
        if (!workStartDate) {
          newErrors.workStartDate = 'Please enter your joining date';
        }
        if (employmentStatus === EMPLOYMENT_STATUS.FORMER && !workEndDate) {
          newErrors.workEndDate = 'Please enter your end date';
        }
        if (workStartDate && workEndDate && new Date(workEndDate) <= new Date(workStartDate)) {
          newErrors.workEndDate = 'End date must be after start date';
        }
        if (!dept.trim()) {
          newErrors.dept = 'Department is required for employees';
        }
        if (!role.trim()) {
          newErrors.role = 'Role is required for employees';
        }
      }
    }

    if (step === 3) {
      if (!content.trim()) {
        newErrors.content = 'Content is required';
      } else if (content.length < MIN_CONTENT_LENGTH) {
        newErrors.content = `Review content must be at least ${MIN_CONTENT_LENGTH} characters long`;
      } else if (content.length > MAX_CONTENT_LENGTH) {
        newErrors.content = `Review content must not exceed ${MAX_CONTENT_LENGTH} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 3) {
        submitReview();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      }`}
      type="button"
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Submit a Company Review</h1>
      <p className="text-gray-600 mb-8">Share your honest workplace experience to help others make informed career decisions.</p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex-1 text-center ${
                stepNumber === step
                  ? 'text-blue-600 font-semibold'
                  : stepNumber < step
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              Step {stepNumber}
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter a title for your review"
                      maxLength={MAX_TITLE_LENGTH}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {title.length} / {MAX_TITLE_LENGTH} characters
                    </div>
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Type
                  </label>
                  <select
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value as ReviewType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)]"
                  >
                    <option value={REVIEW_TYPES.POSITIVE}>Positive</option>
                    <option value={REVIEW_TYPES.MIXED}>Mixed</option>
                    <option value={REVIEW_TYPES.NEGATIVE}>Negative</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Company Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter company name..."
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)]"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={shareName}
                      onChange={(e) => setShareName(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Do you want to share your name?
                    </span>
                  </label>
                </div>

                {shareName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                        errors.reviewerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.reviewerName && (
                      <p className="mt-1 text-sm text-red-500">{errors.reviewerName}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isEmployee}
                      onChange={(e) => setIsEmployee(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Have you worked here?
                    </span>
                  </label>
                </div>

                {isEmployee && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status
                      </label>
                      <select
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)]"
                      >
                        <option value={EMPLOYMENT_STATUS.CURRENT}>Current</option>
                        <option value={EMPLOYMENT_STATUS.FORMER}>Former</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={workStartDate}
                        onChange={(e) => setWorkStartDate(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                          errors.workStartDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.workStartDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.workStartDate}</p>
                      )}
                    </div>

                    {employmentStatus === EMPLOYMENT_STATUS.FORMER && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={workEndDate}
                          onChange={(e) => setWorkEndDate(e.target.value)}
                          min={workStartDate} // Set minimum date to work start date
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                            errors.workEndDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.workEndDate && (
                          <p className="mt-1 text-sm text-red-500">{errors.workEndDate}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                          errors.dept ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your department"
                      />
                      {errors.dept && (
                        <p className="mt-1 text-sm text-red-500">{errors.dept}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
                          errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your role"
                      />
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Content
                </label>
                <div className="relative">
                  <div className={`border rounded-lg ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <div className="border-b border-gray-200 bg-gray-50 p-2 rounded-t-lg">
                      <div className="flex flex-wrap gap-1">
                        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
                          <ToolbarButton
                            onClick={() => {
                              if (editor) {
                                editor.chain().focus().toggleBold().run();
                              }
                            }}
                            isActive={editor?.isActive('bold')}
                            title="Bold"
                          >
                            <Bold size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => {
                              if (editor) {
                                editor.chain().focus().toggleItalic().run();
                              }
                            }}
                            isActive={editor?.isActive('italic')}
                            title="Italic"
                          >
                            <Italic size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => {
                              if (editor) {
                                editor.chain().focus().toggleUnderline().run();
                              }
                            }}
                            isActive={editor?.isActive('underline')}
                            title="Underline"
                          >
                            <UnderlineIcon size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => {
                              if (editor) {
                                editor.chain().focus().toggleStrike().run();
                              }
                            }}
                            isActive={editor?.isActive('strike')}
                            title="Strikethrough"
                          >
                            <Strikethrough size={18} />
                          </ToolbarButton>
                        </div>

                        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor?.isActive('heading', { level: 1 })}
                            title="Heading 1"
                          >
                            <Heading1 size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor?.isActive('heading', { level: 2 })}
                            title="Heading 2"
                          >
                            <Heading2 size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor?.isActive('heading', { level: 3 })}
                            title="Heading 3"
                          >
                            <Heading3 size={18} />
                          </ToolbarButton>
                        </div>

                        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                            isActive={editor?.isActive({ textAlign: 'left' })}
                            title="Align Left"
                          >
                            <AlignLeft size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                            isActive={editor?.isActive({ textAlign: 'center' })}
                            title="Align Center"
                          >
                            <AlignCenter size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                            isActive={editor?.isActive({ textAlign: 'right' })}
                            title="Align Right"
                          >
                            <AlignRight size={18} />
                          </ToolbarButton>
                        </div>

                        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            isActive={editor?.isActive('bulletList')}
                            title="Bullet List"
                          >
                            <List size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            isActive={editor?.isActive('orderedList')}
                            title="Numbered List"
                          >
                            <ListOrdered size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            isActive={editor?.isActive('blockquote')}
                            title="Quote"
                          >
                            <Quote size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            isActive={editor?.isActive('codeBlock')}
                            title="Code Block"
                          >
                            <Code size={18} />
                          </ToolbarButton>
                        </div>

                        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
                          <ToolbarButton
                            onClick={() => {
                              const url = window.prompt('Enter URL');
                              if (url) {
                                editor?.chain().focus().setLink({ href: url }).run();
                              }
                            }}
                            isActive={editor?.isActive('link')}
                            title="Insert Link"
                          >
                            <LinkIcon size={18} />
                          </ToolbarButton>
                        </div>

                        <div className="flex gap-1">
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().undo().run()}
                            title="Undo"
                          >
                            <Undo size={18} />
                          </ToolbarButton>
                          <ToolbarButton
                            onClick={() => editor?.chain().focus().redo().run()}
                            title="Redo"
                          >
                            <Redo size={18} />
                          </ToolbarButton>
                        </div>
                      </div>
                    </div>
                    <EditorContent
                      editor={editor}
                      className="min-h-[200px] focus:outline-none bg-white"
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {content.replace(/<[^>]*>/g, '').length} / {MAX_CONTENT_LENGTH} characters
                  </div>
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isPending}
            className={`ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === 3 ? (isPending ? 'Submitting...' : 'Submit Review') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview; 