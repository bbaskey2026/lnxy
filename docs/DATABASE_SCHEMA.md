# Database Schema Design

The JSON demonstration database will store equivalent collections. PostgreSQL and MongoDB adapters must preserve these relationships and fields.

## Core relationships

- User can have one active role and many enrollments.
- Exam can have many subjects and many course relationships.
- Course belongs to an instructor and can have many modules and lectures.
- Study material belongs to an exam, subject and optional topic.
- Question belongs to subject/topic/exam and has many options.
- Mock test has many questions and many attempts.
- Attempt belongs to one user and one mock test.
- Attempt answer belongs to attempt and question.
- Result belongs to attempt and user.
- Bookmark belongs to user and one polymorphic entity.
- Note belongs to user and optional subject/entity.
- Notification can be delivered to many users through user_notifications.

## Required PostgreSQL tables

| Table | Key fields |
|---|---|
| users | id, name, email, password_hash, role, status, target_exam, timestamps |
| refresh_tokens | id, user_id, token_hash, expires_at, revoked, timestamps |
| exams | id, name, slug, category, description, eligibility, pattern, total_marks, duration_minutes, negative_marking, is_active, timestamps |
| subjects | id, exam_id, name, slug, is_active, timestamps |
| topics | id, subject_id, name, slug, timestamps |
| courses | id, instructor_id, title, description, category, rating, student_count, lecture_count, duration, is_published, timestamps |
| course_exams | course_id, exam_id |
| course_modules | id, course_id, title, sort_order |
| lectures | id, course_id, module_id, title, description, video_source, duration_seconds, sort_order, attachment_url |
| enrollments | id, user_id, course_id, progress_percent, enrolled_at |
| lecture_progress | id, user_id, lecture_id, progress_seconds, is_completed, updated_at |
| study_materials | id, exam_id, subject_id, topic_id, title, category, description, format, file_url, page_count, file_size, popularity_score, is_published, timestamps |
| questions | id, exam_id, subject_id, topic_id, text, type, difficulty, explanation, solution_steps, is_previous_year, year |
| question_options | id, question_id, text, sort_order |
| question_correct_answers | question_id, option_id |
| mock_tests | id, exam_id, title, category, duration_seconds, positive_marks, negative_marks, is_active, timestamps |
| mock_test_sections | id, mock_test_id, name, sort_order |
| mock_test_questions | mock_test_id, question_id, section_id, sort_order, marks |
| test_attempts | id, mock_test_id, user_id, status, started_at, expires_at, submitted_at, timer_seconds |
| attempt_answers | id, attempt_id, question_id, selected_option_id, marked_for_review, updated_at |
| test_results | id, attempt_id, user_id, total_marks, obtained_marks, correct_count, incorrect_count, unattempted_count, accuracy, time_consumed_seconds |
| practice_sessions | id, user_id, mode, started_at, completed_at |
| bookmarks | id, user_id, entity_type, entity_id, created_at |
| notes | id, user_id, subject, title, content, entity_type, entity_id, timestamps |
| current_affairs | id, title, summary, category, importance, published_at |
| notifications | id, title, detail, category, route, timestamps |
| user_notifications | notification_id, user_id, is_read, read_at |
| audit_logs | id, user_id, action, entity_type, entity_id, metadata, created_at |

## JSON demonstration collections

Use one file per primary collection:

`users.json`, `exams.json`, `subjects.json`, `topics.json`, `courses.json`,
`lectures.json`, `materials.json`, `questions.json`, `mock-tests.json`,
`attempts.json`, `results.json`, `bookmarks.json`, `notes.json`,
`notifications.json`, `current-affairs.json`, `refresh-tokens.json`.
