export interface EvaluatorSession {
    id: string;
    reg_no: string;
    college: string;
  }
  
  export interface Subject {
    evaluator_college: string;
    evaluator_reg_no: string;
    subject_code: string;
    subject_name: string;
  }
  
  export interface ReevaluationRequest {
    id: number;
    student_college: string;
    student_reg_no: string;
    sppu_reg_no: string;
    subject_code: string;
    subject_name: string;
    current_marks: number;
    evaluator_college: string | null;
    evaluator_reg_no: string;
    status: string;
    urgency: string | null;
    request_date: string;
    completion_date: string | null;
    reason: string;
    pdf_url: string;
  }
  