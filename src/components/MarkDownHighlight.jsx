import { memo, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; 
import Editor from 'react-simple-code-editor';
import { TbClipboardCopy, TbCopyCheck } from 'react-icons/tb';
import { marked } from 'marked';


marked.setOptions({
    renderer: new marked.Renderer()
});

const MarkdownWithHighlight = ({ content }) => {
    if (!content) {
        return <p className="text-red-500">No content available. Please try refreshing or switching to a different AI model.</p>
    }
    const parts = content.split(/(```[\s\S]*?```)/g);
    return <div className="space-y-4 w-full">
        {
            parts.map((part, idx) => {
                if (part.startsWith('```')) {
                    const raw = part.replace(/```[\s\S]*?\n/, '').trim();
                    const language = part.split("\n")[0].replace("```", "").trim();
                    return <CodeEditor key={idx} code={raw} language={language} />
                }
                return <p key={idx} className="text-base w-full leading-relaxed overflow-x-hidden [&_a]:text-blue-400 [&_a]:hover:text-blue-300" dangerouslySetInnerHTML={{ __html: marked(part).replace(/\n$/, '') }}></p>
            })
        }
    </div>
};

const CodeEditor = ({ code, language }) => {

    const [value, setValue] = useState(code);
    const [isCopied, setIsCopied] = useState(false);

    const highlightCode = (code) => {
        return hljs.highlightAuto(code).value;
    }
      
    const handleCopy = async () => {
        await navigator.clipboard.writeText(value.replaceAll("```", ""));
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

  return <div className="border rounded-lg overflow-hidden bg-black/30">
      <div className="text-sm flex items-center justify-between p-2 bg-white/5 text-gray-400 mb-2">
          <div>{language.toUpperCase()}</div>
          <div className='flex items-center cursor-pointer' onClick={handleCopy}>{isCopied ? <TbCopyCheck size={16} /> : <TbClipboardCopy size={16} />}</div>
      </div>

      <Editor
          value={value.replaceAll("```", "")}
          onValueChange={setValue}
          highlight={highlightCode}
          padding={10}
          className="react-simple-code-editor"
          style={{
              fontFamily: 'var(--font-jet)',
              fontSize: 14,
              backgroundColor: 'transparent',
              color: '#fff'
          }}
      />
    </div>
}

export default memo(MarkdownWithHighlight);
