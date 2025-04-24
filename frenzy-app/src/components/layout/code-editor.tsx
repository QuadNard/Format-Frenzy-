// components/morphing-code-editor.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { Editor, OnMount, OnChange } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import { ChevronDown, Code, Maximize2 } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogTitle,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from '../ui/morphing-dialog';

interface MorphingCodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  height?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  theme?: string;
  title?: string;
}

const MorphingCodeEditor: React.FC<MorphingCodeEditorProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Add your code here',
  height = '16rem',
  onChange = () => {},
  readOnly = false,
  theme = 'vs-dark',
  title = 'Code Editor',
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<string>(height);
  const [editorWidth, setEditorWidth] = useState<string>('100%');
  const [code, setCode] = useState<string>(defaultValue);

  // Function to handle editor mounting for compact view
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Function to handle editor mounting for expanded view
  const handleExpandedEditorDidMount: OnMount = (editor) => {
    // Set the expanded editor with same content
    editor.setValue(code);

    // Focus the editor when expanded
    editor.focus();

    // Optional: position cursor at the end
    const model = editor.getModel();
    if (model) {
      const lastLine = model.getLineCount();
      const lastColumn = model.getLineMaxColumn(lastLine);
      editor.setPosition({ lineNumber: lastLine, column: lastColumn });
    }
  };

  // Handle editor content changes
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setCode(value);
      onChange(value);
    }
  };

  // Handle expanded editor content changes
  const handleExpandedEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setCode(value);
      onChange(value);
    }
  };

  // Effect to handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        if (containerWidth < 350) {
          setEditorHeight('12rem');
        } else if (containerWidth < 600) {
          setEditorHeight('14rem');
        } else {
          setEditorHeight(height);
        }

        setEditorWidth(`${containerWidth}px`);
      }
    };

    // Initial sizing
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return (
    <div ref={containerRef} className='w-full'>
      <MorphingDialog
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 24,
        }}
      >
        {/* Compact Editor View */}
        <MorphingDialogTrigger
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
          }}
          className='w-full border border-gray-200/60 bg-zinc-950'
        >
          <div className='w-full'>
            {/* Header for the editor */}
            <div className='flex items-center justify-between bg-zinc-800 px-4 py-2'>
              <div className='flex items-center'>
                <Code className='mr-2 h-4 w-4 text-gray-400' />
                <MorphingDialogTitle className='text-sm font-medium text-gray-200'>
                  {title}
                </MorphingDialogTitle>
              </div>
              <Maximize2 className='h-4 w-4 text-gray-400' />
            </div>

            {/* Compact Editor */}
            <Editor
              height={editorHeight}
              width={editorWidth}
              defaultLanguage={defaultLanguage}
              defaultValue={defaultValue}
              value={code}
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
              theme={theme}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                readOnly: readOnly,
                lineNumbers: 'on',
                folding: true,
                renderLineHighlight: 'all',
              }}
              className='overflow-hidden rounded-b-md'
            />
          </div>
        </MorphingDialogTrigger>

        {/* Expanded Editor View */}
        <MorphingDialogContainer>
          <MorphingDialogContent
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
            }}
            className='relative h-auto w-[90vw] max-w-[900px] border border-gray-100 bg-zinc-950'
          >
            <div className='flex items-center justify-between bg-zinc-800 px-4 py-2'>
              <div className='flex items-center'>
                <Code className='mr-2 h-5 w-5 text-gray-400' />
                <MorphingDialogTitle className='text-md font-medium text-gray-200'>
                  {title}
                </MorphingDialogTitle>
              </div>
            </div>

            <ScrollArea className='h-[80vh]' type='scroll'>
              <Editor
                height='calc(80vh - 40px)'
                defaultLanguage={defaultLanguage}
                value={code}
                onMount={handleExpandedEditorDidMount}
                onChange={handleExpandedEditorChange}
                theme={theme}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  readOnly: readOnly,
                  lineNumbers: 'on',
                  folding: true,
                  renderLineHighlight: 'all',
                }}
              />
            </ScrollArea>

            <MorphingDialogClose className='absolute top-2 right-2 text-zinc-500' />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </div>
  );
};

export default MorphingCodeEditor;
