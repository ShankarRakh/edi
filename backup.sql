--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: evaluator_auth; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.evaluator_auth (
    id integer NOT NULL,
    college_name character varying(100) NOT NULL,
    college_reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.evaluator_auth OWNER TO neondb_owner;

--
-- Name: evaluator_auth_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.evaluator_auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluator_auth_id_seq OWNER TO neondb_owner;

--
-- Name: evaluator_auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.evaluator_auth_id_seq OWNED BY public.evaluator_auth.id;


--
-- Name: evaluator_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.evaluator_details (
    college_name character varying(100) NOT NULL,
    reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    year_of_experience integer NOT NULL,
    rating numeric(3,2) DEFAULT 0.0,
    pending_review_requests integer DEFAULT 0,
    under_review_requests integer DEFAULT 0,
    completed_today_requests integer DEFAULT 0,
    avg_time_to_complete numeric(5,2) DEFAULT NULL::numeric,
    metamaskid character varying(255)
);


ALTER TABLE public.evaluator_details OWNER TO neondb_owner;

--
-- Name: evaluator_subjects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.evaluator_subjects (
    evaluator_college character varying(100) NOT NULL,
    evaluator_reg_no character varying(50) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100) NOT NULL
);


ALTER TABLE public.evaluator_subjects OWNER TO neondb_owner;

--
-- Name: reevaluation_ratings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reevaluation_ratings (
    id integer NOT NULL,
    request_id integer NOT NULL,
    student_college character varying(100) NOT NULL,
    student_reg_no character varying(50) NOT NULL,
    evaluator_college character varying(100) NOT NULL,
    evaluator_reg_no character varying(50) NOT NULL,
    rating integer NOT NULL,
    feedback text,
    CONSTRAINT reevaluation_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reevaluation_ratings OWNER TO neondb_owner;

--
-- Name: reevaluation_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reevaluation_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reevaluation_ratings_id_seq OWNER TO neondb_owner;

--
-- Name: reevaluation_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reevaluation_ratings_id_seq OWNED BY public.reevaluation_ratings.id;


--
-- Name: reevaluation_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reevaluation_requests (
    id integer NOT NULL,
    student_college character varying(100) NOT NULL,
    student_reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100) NOT NULL,
    current_marks integer NOT NULL,
    evaluator_college character varying(100) DEFAULT NULL::character varying,
    evaluator_reg_no character varying(50) DEFAULT NULL::character varying,
    status character varying(20) DEFAULT 'Pending'::character varying,
    urgency character varying(10) DEFAULT NULL::character varying,
    request_date timestamp without time zone DEFAULT now(),
    completion_date timestamp without time zone,
    reason text,
    pdf_url text,
    updated_marks integer,
    final_marks integer,
    CONSTRAINT reevaluation_requests_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Under Review'::character varying, 'Completed'::character varying])::text[])))
);


ALTER TABLE public.reevaluation_requests OWNER TO neondb_owner;

--
-- Name: reevaluation_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reevaluation_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reevaluation_requests_id_seq OWNER TO neondb_owner;

--
-- Name: reevaluation_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reevaluation_requests_id_seq OWNED BY public.reevaluation_requests.id;


--
-- Name: student_auth; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_auth (
    id integer NOT NULL,
    college_name character varying(100) NOT NULL,
    college_reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.student_auth OWNER TO neondb_owner;

--
-- Name: student_auth_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.student_auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_auth_id_seq OWNER TO neondb_owner;

--
-- Name: student_auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.student_auth_id_seq OWNED BY public.student_auth.id;


--
-- Name: student_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_details (
    college_name character varying(100) NOT NULL,
    reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    year_of_study integer NOT NULL,
    department character varying(100) NOT NULL,
    semester integer NOT NULL,
    recent_request_id integer,
    pending_requests integer DEFAULT 0,
    total_requests integer DEFAULT 0,
    completed_requests integer DEFAULT 0,
    metamaskid character varying(255)
);


ALTER TABLE public.student_details OWNER TO neondb_owner;

--
-- Name: student_subjects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_subjects (
    student_college character varying(100) NOT NULL,
    student_reg_no character varying(50) NOT NULL,
    sppu_reg_no character varying(50) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100) NOT NULL,
    current_marks integer NOT NULL,
    answer_sheet_url text NOT NULL
);


ALTER TABLE public.student_subjects OWNER TO neondb_owner;

--
-- Name: evaluator_auth id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_auth ALTER COLUMN id SET DEFAULT nextval('public.evaluator_auth_id_seq'::regclass);


--
-- Name: reevaluation_ratings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_ratings ALTER COLUMN id SET DEFAULT nextval('public.reevaluation_ratings_id_seq'::regclass);


--
-- Name: reevaluation_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_requests ALTER COLUMN id SET DEFAULT nextval('public.reevaluation_requests_id_seq'::regclass);


--
-- Name: student_auth id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_auth ALTER COLUMN id SET DEFAULT nextval('public.student_auth_id_seq'::regclass);


--
-- Data for Name: evaluator_auth; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluator_auth (id, college_name, college_reg_no, sppu_reg_no, email, password_hash, created_at) FROM stdin;
\.


--
-- Data for Name: evaluator_details; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluator_details (college_name, reg_no, sppu_reg_no, first_name, last_name, year_of_experience, rating, pending_review_requests, under_review_requests, completed_today_requests, avg_time_to_complete, metamaskid) FROM stdin;
COEP	EVAL001	SPPU_E001	Amit	Joshi	10	4.80	0	0	0	\N	0x987XYZ654LMN3210
VIT Pune	EVAL002	SPPU_E002	Priya	Deshmukh	7	4.50	0	0	0	\N	0x654LMN987XYZ3210
\.


--
-- Data for Name: evaluator_subjects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluator_subjects (evaluator_college, evaluator_reg_no, subject_code, subject_name) FROM stdin;
COEP	EVAL001	CS301	Data Structures
VIT Pune	EVAL002	IT201	Database Systems
COEP	EVAL001	CS303	OOPS
COEP	EVAL001	CS306	Algorithms
COEP	EVAL001	CS307	Operating Systems
COEP	EVAL001	CS304	Computer Networks
COEP	EVAL001	CS305	Database Management
\.


--
-- Data for Name: reevaluation_ratings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reevaluation_ratings (id, request_id, student_college, student_reg_no, evaluator_college, evaluator_reg_no, rating, feedback) FROM stdin;
\.


--
-- Data for Name: reevaluation_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reevaluation_requests (id, student_college, student_reg_no, sppu_reg_no, subject_code, subject_name, current_marks, evaluator_college, evaluator_reg_no, status, urgency, request_date, completion_date, reason, pdf_url, updated_marks, final_marks) FROM stdin;
14	COEP	COEP123	SPPU001	CS304	Computer Networks	35	\N	\N	Pending	normal	2025-02-23 07:08:04.731379	\N	i am looking at question number 1 and 2 ,  i think 	https://cloud-storage.com/answersheet5.pdf	\N	\N
9	COEP	COEP123	SPPU001	CS303	Operating Systems	40	COEP	EVAL001	Pending	normal	2025-02-22 18:30:07.337974	\N	Possible calculation mistake.	https://cloud-storage.com/answersheet4.pdf	0	\N
10	COEP	COEP123	SPPU001	CS304	Computer Networks	35	COEP	EVAL001	Under Review	normal	2025-02-22 18:30:07.337974	\N	Marking was too strict.	https://cloud-storage.com/answersheet5.pdf	0	\N
11	COEP	COEP123	SPPU001	CS305	Database Management	45	COEP	EVAL001	Pending	normal	2025-02-22 18:30:07.337974	\N	Requesting recheck.	https://cloud-storage.com/answersheet6.pdf	0	\N
7	COEP	COEP123	SPPU001	CS301	Data Structures	34	COEP	EVAL001	Under Review	medium	2025-02-22 18:30:07.337974	\N	Marks seem incorrect.	https://cloud-storage.com/answersheet1.pdf	0	\N
8	COEP	COEP123	SPPU001	CS302	Algorithms	48	COEP	EVAL001	Under Review	normal	2025-02-22 18:30:07.337974	\N	Missed some points.	https://cloud-storage.com/answersheet3.pdf	0	\N
\.


--
-- Data for Name: student_auth; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_auth (id, college_name, college_reg_no, sppu_reg_no, email, password_hash, created_at) FROM stdin;
\.


--
-- Data for Name: student_details; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_details (college_name, reg_no, sppu_reg_no, first_name, last_name, year_of_study, department, semester, recent_request_id, pending_requests, total_requests, completed_requests, metamaskid) FROM stdin;
VIT Pune	VIT456	SPPU002	Sneha	Patil	2	Information Technology	4	\N	5	12	13	0xDEF789ABC1234567
COEP	COEP123	SPPU001	Rahul	Sharma	3	Computer Science	6	14	3	3	0	0xABC123DEF4567890
\.


--
-- Data for Name: student_subjects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_subjects (student_college, student_reg_no, sppu_reg_no, subject_code, subject_name, current_marks, answer_sheet_url) FROM stdin;
COEP	COEP123	SPPU001	CS301	Data Structures	42	https://cloud-storage.com/answersheet1.pdf
VIT Pune	VIT456	SPPU002	IT201	Database Systems	36	https://cloud-storage.com/answersheet2.pdf
COEP	COEP123	SPPU001	CS302	Algorithms	48	https://cloud-storage.com/answersheet3.pdf
COEP	COEP123	SPPU001	CS303	Operating Systems	40	https://cloud-storage.com/answersheet4.pdf
COEP	COEP123	SPPU001	CS304	Computer Networks	35	https://cloud-storage.com/answersheet5.pdf
COEP	COEP123	SPPU001	CS305	Database Management	45	https://cloud-storage.com/answersheet6.pdf
\.


--
-- Name: evaluator_auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluator_auth_id_seq', 1, false);


--
-- Name: reevaluation_ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reevaluation_ratings_id_seq', 8, true);


--
-- Name: reevaluation_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reevaluation_requests_id_seq', 14, true);


--
-- Name: student_auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.student_auth_id_seq', 1, false);


--
-- Name: evaluator_auth evaluator_auth_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_auth
    ADD CONSTRAINT evaluator_auth_email_key UNIQUE (email);


--
-- Name: evaluator_auth evaluator_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_auth
    ADD CONSTRAINT evaluator_auth_pkey PRIMARY KEY (id);


--
-- Name: evaluator_details evaluator_details_metamaskid_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_details
    ADD CONSTRAINT evaluator_details_metamaskid_key UNIQUE (metamaskid);


--
-- Name: evaluator_details evaluator_details_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_details
    ADD CONSTRAINT evaluator_details_pkey PRIMARY KEY (college_name, reg_no);


--
-- Name: evaluator_subjects evaluator_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_subjects
    ADD CONSTRAINT evaluator_subjects_pkey PRIMARY KEY (evaluator_college, evaluator_reg_no, subject_code);


--
-- Name: reevaluation_ratings reevaluation_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_ratings
    ADD CONSTRAINT reevaluation_ratings_pkey PRIMARY KEY (id);


--
-- Name: reevaluation_requests reevaluation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_requests
    ADD CONSTRAINT reevaluation_requests_pkey PRIMARY KEY (id);


--
-- Name: student_auth student_auth_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_auth
    ADD CONSTRAINT student_auth_email_key UNIQUE (email);


--
-- Name: student_auth student_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_auth
    ADD CONSTRAINT student_auth_pkey PRIMARY KEY (id);


--
-- Name: student_details student_details_metamaskid_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_details
    ADD CONSTRAINT student_details_metamaskid_key UNIQUE (metamaskid);


--
-- Name: student_details student_details_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_details
    ADD CONSTRAINT student_details_pkey PRIMARY KEY (college_name, reg_no);


--
-- Name: student_subjects student_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_pkey PRIMARY KEY (student_college, student_reg_no, subject_code);


--
-- Name: evaluator_subjects evaluator_subjects_evaluator_college_evaluator_reg_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluator_subjects
    ADD CONSTRAINT evaluator_subjects_evaluator_college_evaluator_reg_no_fkey FOREIGN KEY (evaluator_college, evaluator_reg_no) REFERENCES public.evaluator_details(college_name, reg_no) ON DELETE CASCADE;


--
-- Name: reevaluation_ratings reevaluation_ratings_evaluator_college_evaluator_reg_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_ratings
    ADD CONSTRAINT reevaluation_ratings_evaluator_college_evaluator_reg_no_fkey FOREIGN KEY (evaluator_college, evaluator_reg_no) REFERENCES public.evaluator_details(college_name, reg_no) ON DELETE CASCADE;


--
-- Name: reevaluation_ratings reevaluation_ratings_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_ratings
    ADD CONSTRAINT reevaluation_ratings_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.reevaluation_requests(id) ON DELETE CASCADE;


--
-- Name: reevaluation_requests reevaluation_requests_evaluator_college_evaluator_reg_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_requests
    ADD CONSTRAINT reevaluation_requests_evaluator_college_evaluator_reg_no_fkey FOREIGN KEY (evaluator_college, evaluator_reg_no) REFERENCES public.evaluator_details(college_name, reg_no) ON DELETE SET NULL;


--
-- Name: reevaluation_requests reevaluation_requests_student_college_student_reg_no_subje_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reevaluation_requests
    ADD CONSTRAINT reevaluation_requests_student_college_student_reg_no_subje_fkey FOREIGN KEY (student_college, student_reg_no, subject_code) REFERENCES public.student_subjects(student_college, student_reg_no, subject_code) ON DELETE CASCADE;


--
-- Name: student_subjects student_subjects_student_college_student_reg_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_student_college_student_reg_no_fkey FOREIGN KEY (student_college, student_reg_no) REFERENCES public.student_details(college_name, reg_no) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

