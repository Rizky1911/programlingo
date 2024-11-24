'use client'

import { useState, useEffect, useRef } from 'react'
//import Link from 'next/link'
import { useRouter } from 'next/navigation'
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  //Code,
  Play,
  CheckCircle,
  XCircle,
  GripVertical,
  GripHorizontal,
  Send,
  //RefreshCw,
  FileText,
  Terminal,
  Loader2,
  Check,
  X
} from "lucide-react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Editor, { OnMount } from "@monaco-editor/react"
import * as monaco from 'monaco-editor'
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios"
import OutputWindow from './output-window'
import { Output } from '@/lib/interface'
import { InputDialog } from './input-dialog'

// Mock data for the question
const questionData = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:

2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.`,
  initialCode: `panjang = int(input())  # jangan hapus kode ini
lebar = int(input())  # jangan hapus kode ini

# ganti dengan kode yang sesuai
luas = ______

print(luas)`
}

const testCases = [
  { input: "panjang = 5, lebar = 9", expectedOutput: "45", inputValue: "5\n9" },
  { input: "panjang = 3, lebar = 6", expectedOutput: "18", inputValue: "3\n6" },
  { input: "panjang = 10, lebar = 6", expectedOutput: "60", inputValue: "10\n6" },
]

const SuccessPopup = ({ onBackToCourse, onContinue }:{ onBackToCourse: () => void, onContinue: () => void }) => (
  <AnimatePresence>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-4"
        >
          <Check className="w-16 h-16 text-green-500 mx-auto" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">Lesson completed!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You learned Two Sum. You are one step closer to reaching your goal!
          </p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <h3 className="font-semibold mb-2">Your reward:</h3>
            <p className="text-lg">+10 XP</p>
            <p className="text-lg">+5 🧊</p>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col space-y-2"
          >
            <Button onClick={onBackToCourse} variant="outline" className="w-full">
              Back to Course
            </Button>
            <Button onClick={onContinue} className="w-full">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </AnimatePresence>
)

const LeaveConfirmDialog = ({
  open,
  onOpenChange,
  onLeave
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeave: () => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave?</DialogTitle>
          <DialogDescription>
            If you leave the Code Coach without solving, your changes will not be saved
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={onLeave}>
            Leave
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Stay and solve!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



export default function CodingChallengePage() {
  const [code, setCode] = useState(questionData.initialCode)
  const [output, setOutput] = useState<Output | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [testResults, setTestResults] = useState(testCases.map(() => ({ passed: false, output: '' })))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isRunning, setIsRunning] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const router = useRouter()
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [inputVariables, setInputVariables] = useState<string[]>([])
  const [pendingCode, setPendingCode] = useState('')

  const detectInputVariables = (code: string): string[] => {
    const regex = /(\b\w+)\s*=\s*.*\binput\(\)/g;
    const matches = Array.from(code.matchAll(regex))
    return matches.map(match => match[1])
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handleRunCode = async () => {
    setIsRunning(true)
    if (editorRef.current) {
      const editorCode = editorRef.current.getValue()
      const variables = detectInputVariables(editorCode)
      setCode(editorCode)

      console.log(variables.length)

      if (variables.length > 0) {
        setInputVariables(variables)
        setPendingCode(editorCode)
        setShowInputDialog(true)
        setIsRunning(false)
        return
      }

      executeCode(editorCode, '')
    }
    
    //setOutput("Output: [0, 1]")
    setIsSubmitted(false)
    setActiveTab('code')
  }

  const executeCode = (code: string, inputs: string) => {
    const formData = {
      language_id: 71,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(inputs),
    };
    const options = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        // "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        // "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    console.log("Request options:", options);

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        //const error = err.response ? err.response.data : err;
        // get error status
        // const status = err.response.status;
        // console.log("status", status);
        
        setIsRunning(false);
        console.log(err);
      });
  }

  const handleInputSubmit = async (inputs: string) => {
    setIsRunning(true)
    executeCode(pendingCode, inputs)
    setIsSubmitted(false)
    setActiveTab('code')
  }

  const handleSubmit = async () => {
    setIsRunning(true);
  
    if (editorRef.current) {
      const editorCode = editorRef.current.getValue();
      setCode(editorCode);
  
      try {
        const results = await Promise.all(
          testCases.map(async (testCase) => {
            const formData = {
              language_id: 71,
              source_code: btoa(editorCode),
              stdin: btoa(testCase.inputValue),
              expected_output: btoa(testCase.expectedOutput),
            };
  
            const options = {
              method: "POST",
              url: process.env.NEXT_PUBLIC_RAPID_API_URL,
              params: { base64_encoded: "true", fields: "*" },
              headers: {
                "content-type": "application/json",
              },
              data: formData,
            };
  
            console.log("Request options:", options);
  
            // First API call to get the token
            const response = await axios.request(options);
            console.log("POST response data:", response.data);
  
            const token = response.data?.token;
  
            if (!token) {
              throw new Error("Token is null or undefined in response");
            }
  
            // Second API call to check the status using the token
            const test = await checkStatusSubmit(token);
  
            if (!test || !test.status) {
              throw new Error("Unexpected response structure in checkStatusSubmit");
            }
  
            if (test.status.id === 6) {
              return { passed: false, output: test.compile_output || "No compile output" };
            }
  
            if (test.status.id === 4) {
              return { passed: false, output: atob(test.stdout || "") };
            }
  
            if (test.status.id === 3) {
              return { passed: true, output: atob(test.stdout || "") };
            }
  
            return { passed: false, output: atob(test.stderr || "") };
          })
        );
  
        setTestResults(results);
        setIsSubmitted(true);
        const allPassed = results.every((result) => result.passed);
        setAllTestsPassed(allPassed);
  
        if (allPassed) {
          setShowSuccessPopup(true);
        }
      } catch (error) {
        console.log("Error in handleSubmit:", error);
      }
    }
  
    setActiveTab("code");
    setIsRunning(false);
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleBackToCourse = () => {
    // Implement navigation to course overview
    console.log("Navigating back to course overview")
    setShowSuccessPopup(false)
    router.push('/course-preview')
  }

  const handleContinue = () => {
    // Implement navigation to next lesson
    console.log("Navigating to next lesson")
    setShowSuccessPopup(false)
  }

  const handleLeave = () => {
    setShowLeaveDialog(false)
    // Use setTimeout to ensure the dialog is closed before navigation
    setTimeout(() => {
      router.push('/course-overview')
    }, 0)
  }

  const handleBackButton = () => {
    setShowLeaveDialog(true)
  }

  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      // headers: {
      //   "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
      //   "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      // },
    };
    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;
      console.log("checkStatus response data:", response.data.status?.id);
      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setIsRunning(false);
        setOutput(response.data);
        console.log("response.data", response.data.stdout);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setIsRunning(false);
    }
  };

  const checkStatusSubmit = async (token: string) => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
    };
  
    try {
      const response = await axios.request(options);
      console.log("checkStatusSubmit response data:", response.data);  // Log the full response
  
      const statusId = response.data.status?.id;
  
      // Check if the API is still processing
      if (statusId === 1 || statusId === 2) {
        // If processing, retry after a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await checkStatusSubmit(token);
      } else {
        return response.data;
      }
    } catch (err) {
      console.log("Error in checkStatusSubmit:", err);
      throw new Error("Unexpected response structure in checkStatusSubmit");
    }
  };

  const CodeEditor = () => (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center p-2 bg-gray-100 dark:bg-gray-800">
        <Button onClick={handleRunCode} size="sm" disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </>
          )}
        </Button>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          defaultLanguage="python"
          defaultValue={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 4,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: isRunning,
          }}
        />
      </div>
    </div>
  )

  const MobileLayout = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">
          <FileText className="w-4 h-4 mr-2" />
          Description
        </TabsTrigger>
        <TabsTrigger value="code">
          <Terminal className="w-4 h-4 mr-2" />
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="flex-grow overflow-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap">{questionData.description}</pre>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code" className="flex-grow overflow-hidden flex flex-col">
        <PanelGroup direction="vertical" className="h-full">
          <Panel defaultSize={70} minSize={30}>
            <CodeEditor />
          </Panel>
          <PanelResizeHandle className="h-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <div className="w-full flex items-center justify-center">
              <GripHorizontal className="h-6 w-6 text-gray-400" />
            </div>
          </PanelResizeHandle>
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full overflow-auto p-4 bg-gray-900 text-white">
              {isSubmitted ? (
                <div>
                  <Tabs defaultValue="test1">
                    <TabsList>
                      {testResults.map((result, index) => (
                        <TabsTrigger key={index} value={`test${index + 1}`}>
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          Test case {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {testResults.map((result, index) => (
                      <TabsContent key={index} value={`test${index + 1}`}>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Input:</h3>
                            <pre className="bg-gray-800 p-2 rounded">{testCases[index].input}</pre>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Your Output:</h3>
                            <pre className="bg-gray-800 p-2 rounded">{result.output}</pre>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Expected Output:</h3>
                            <pre className="bg-gray-800 p-2 rounded">{testCases[index].expectedOutput}</pre>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Output</h2>
                  {/* <pre className="bg-gray-800 p-4 rounded-md whitespace-pre-wrap">
                    {output || 'Run your code to see the output here'}
                  </pre> */}
                  <OutputWindow outputDetails={output as Output} />
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </TabsContent>
    </Tabs>
  )

  const DesktopLayout = () => (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={40} minSize={30}>
        <div className="h-full overflow-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap">{questionData.description}</pre>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        <div className="h-full flex items-center justify-center">
          <GripVertical className="h-6 w-6 text-gray-400" />
        </div>
      </PanelResizeHandle>
      <Panel defaultSize={60} minSize={30}>
        <PanelGroup direction="vertical" className="h-full">
          <Panel defaultSize={70} minSize={30}>
            <CodeEditor />
          </Panel>
          <PanelResizeHandle className="h-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <div className="w-full flex items-center justify-center">
              <GripHorizontal className="h-6 w-6 text-gray-400" />
            </div>
          
          </PanelResizeHandle>
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full overflow-auto p-4 bg-gray-900 text-white">
              {isSubmitted ? (
                <div>
                  <Tabs defaultValue="test1">
                    <TabsList>
                      {testResults.map((result, index) => (
                        <TabsTrigger key={index} value={`test${index + 1}`}>
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          Test case {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {testResults.map((result, index) => (
                      <TabsContent key={index} value={`test${index + 1}`}>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Input:</h3>
                            <pre className="bg-gray-800  p-2 rounded">{testCases[index].input}</pre>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Your Output:</h3>
                            <pre className="bg-gray-800 p-2 rounded">{result.output}</pre>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Expected Output:</h3>
                            <pre className="bg-gray-800 p-2 rounded">{testCases[index].expectedOutput}</pre>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Output</h2>
                  {/* <pre className="bg-gray-800 p-4 rounded-md whitespace-pre-wrap">
                    {output || 'Run your code to see the output here'}
                  </pre> */}
                  <OutputWindow outputDetails={output as Output} />
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  )

  useEffect(() => {
    if (showSuccessPopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showSuccessPopup])

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleBackButton}>
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">{questionData.title}</h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className={`px-2 py-1 rounded text-xs md:text-sm ${
              questionData.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              questionData.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {questionData.difficulty}
            </span>
            <Button variant="default" size="sm" onClick={handleSubmit} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        {isMobile ? <MobileLayout /> : <DesktopLayout />}
      </div>

      {showSuccessPopup && (
        <SuccessPopup onBackToCourse={handleBackToCourse} onContinue={handleContinue} />
      )}
      <LeaveConfirmDialog 
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        onLeave={handleLeave}
      />
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        variables={inputVariables}
        onSubmit={handleInputSubmit}
      />
    </div>
  )
}