import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MarkEvaluation = () => {
  const markIncrements = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const [questions, setQuestions] = useState([]);
  const [draggedMark, setDraggedMark] = useState(null);
  const [dragCount, setDragCount] = useState(0);
  const [totalDraggedMarks, setTotalDraggedMarks] = useState(0);

  useEffect(() => {
    // Get total marks from sessionStorage
    const totalMarks = parseInt(sessionStorage.getItem('current_marks')) || 0;
    const savedDragCount = parseInt(sessionStorage.getItem('drag_count')) || 0;
    const savedDraggedMarks = parseFloat(sessionStorage.getItem('updated_marks')) || 0;
    
    setDragCount(savedDragCount);
    setTotalDraggedMarks(savedDraggedMarks);
    
    const distributeMarks = (total, numQuestions) => {
      const baseAmount = Math.floor(total / numQuestions);
      const remainder = total % numQuestions;
      
      let distribution = Array(numQuestions).fill(baseAmount);
      
      let remainingAmount = remainder;
      while (remainingAmount > 0) {
        const randomIndex = Math.floor(Math.random() * numQuestions);
        distribution[randomIndex]++;
        remainingAmount--;
      }
      
      return distribution.sort(() => Math.random() - 0.5);
    };

    // Initialize questions with distributed marks
    const distributedMarks = distributeMarks(totalMarks, 4);
    const initialQuestions = Array.from({ length: 4 }, (_, index) => ({
      id: `q${index + 1}`,
      questionNo: index + 1,
      marks: distributedMarks[index]
    }));

    setQuestions(initialQuestions);
  }, []);

  const handleDragStart = (mark) => {
    setDraggedMark(mark);
  };

  const handleDrop = (questionId) => {
    if (draggedMark !== null) {
      // Update questions marks
      setQuestions(prevQuestions => 
        prevQuestions.map(q => {
          if (q.id === questionId) {
            const newMarks = Number((q.marks + draggedMark).toFixed(1));
            return {
              ...q,
              marks: newMarks
            };
          }
          return q;
        })
      );
      
      // Update drag count
      const newDragCount = dragCount + 1;
      setDragCount(newDragCount);
      sessionStorage.setItem('drag_count', newDragCount.toString());
      
      // Update total dragged marks
      const newTotalDraggedMarks = Number((totalDraggedMarks + draggedMark).toFixed(1));
      setTotalDraggedMarks(newTotalDraggedMarks);
      sessionStorage.setItem('updated_marks', newTotalDraggedMarks.toString());
      
      setDraggedMark(null);
    }
  };

  const totalCurrentMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mark Evaluation</span>
          <div className="flex flex-col items-end text-sm font-normal">
            <span>Current Total: {totalCurrentMarks.toFixed(1)} marks</span>
            <span>Total Dragged Marks: {totalDraggedMarks.toFixed(1)}</span>
            <span>Drag Count: {dragCount}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Available Mark Increments</Label>
            <div className="flex flex-wrap gap-2">
              {markIncrements.map((mark) => (
                <Button
                  key={`mark-${mark}`}
                  variant="outline"
                  size="sm"
                  draggable
                  onDragStart={() => handleDragStart(mark)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  +{mark}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4">
            <Label>Questions</Label>
            {questions.map((question) => (
              <div
                key={question.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(question.id)}
                className={`p-4 rounded-lg border-2 ${
                  draggedMark !== null ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Question {question.questionNo}</span>
                  <span className="text-lg font-semibold">{question.marks.toFixed(1)} marks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkEvaluation;