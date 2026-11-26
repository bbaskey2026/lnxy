# Frontend Analysis

## Application pages

| Page | Purpose | Primary data |
|---|---|---|
| Login / Register | Student, instructor and admin authentication | name, email, password, role |
| Student Dashboard | Overview of progress and schedule | user, exam progress, study time, tests, activities, recommendations |
| Examination Discovery / Detail | Browse examinations and view exam rules | exams, eligibility, pattern, marks, duration, subjects, papers, mock tests |
| Courses / Course Detail | Discover and continue enrolled courses | course, instructor, rating, lecture count, duration, modules, progress |
| Lectures | Stream, resume and complete lessons | lecture, source, duration, progress, bookmark, completed state, notes |
| Study Materials | Search and download preparation resources | title, category, exam, subject, topic, format, size, popularity |
| Mock Tests / Test Runner | Timed test execution and results | test, questions, options, answers, timer, review state, scoring |
| Practice | Filtered question practice | examination, subject, chapter, difficulty, type, answer, explanation |
| Previous Papers | Filter/download previous-year papers | examination, year, subject, question count, size |
| Current Affairs | Browse and bookmark current affairs | date, category, title, summary, importance |
| Bookmarks | Unified saved items | entity type, entity id, title, subtitle |
| Notes | Create, edit, filter and delete personal notes | title, subject, content, timestamps |
| Analytics | Performance and preparation insights | score trend, study time, subject/topic accuracy, strong/weak topics |
| Notifications | Read notification history | title, detail, category, route, read state, createdAt |
| Profile | Update learner profile | name, email, target exam |
| Admin | Manage platform entities and users | examinations, courses, materials, users, reports |

## High-value field mapping

| Frontend field | Backend field | Database column |
|---|---|---|
| user.id | id | id |
| user.name | name | name |
| user.email | email | email |
| user.role | role | role |
| exam.id | id | id |
| exam.name | name | name |
| exam.category | category | category |
| exam.description | description | description |
| exam.duration | durationMinutes | duration_minutes |
| exam.totalMarks | totalMarks | total_marks |
| exam.negativeMarking | negativeMarking | negative_marking |
| course.title | title | title |
| course.instructor | instructorName | instructor_id |
| course.rating | rating | rating |
| course.students | studentCount | student_count |
| course.lectures | lectureCount | lecture_count |
| course.duration | duration | duration |
| course.progress | progress | progress_percent |
| lecture.duration | duration | duration_seconds |
| lecture.seconds | progressSeconds | progress_seconds |
| lecture.completed | isCompleted | is_completed |
| resource.category | category | category |
| resource.examination | examName | exam_id |
| resource.subject | subjectName | subject_id |
| resource.topic | topicName | topic_id |
| resource.format | format | format |
| resource.pages | pageCount | page_count |
| resource.size | fileSize | file_size |
| resource.popularity | popularity | popularity_score |
| question.text | text | text |
| question.options | options | separate question_options relation |
| question.correctIndex | correctOptionId | separate question_correct_answers relation |
| question.explanation | explanation | explanation |
| test.durationSeconds | durationSeconds | duration_seconds |
| test.positiveMarks | positiveMarks | positive_marks |
| test.negativeMarks | negativeMarks | negative_marks |
| result.correct | correctCount | correct_count |
| result.incorrect | incorrectCount | incorrect_count |
| result.unattempted | unattemptedCount | unattempted_count |
| result.accuracy | accuracy | accuracy |
| bookmark.type | entityType | entity_type |
| bookmark.id | entityId | entity_id |
| note.subject | subject | subject |
| note.content | content | content |
| notification.read | isRead | is_read |
| notification.createdAt | createdAt | created_at |

## Frontend API requirements

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/exams`
- `GET /api/v1/exams/:examId`
- `GET /api/v1/courses`
- `GET /api/v1/courses/:courseId`
- `GET /api/v1/courses/enrolled`
- `POST /api/v1/courses/:courseId/enroll`
- `GET /api/v1/study-materials`
- `GET /api/v1/lectures`
- `GET /api/v1/lectures/:lectureId`
- `GET /api/v1/questions`
- `GET /api/v1/mock-tests`
- `GET /api/v1/mock-tests/:testId`
- `POST /api/v1/attempts`
- `PATCH /api/v1/attempts/:attemptId/answers`
- `POST /api/v1/attempts/:attemptId/submit`
- `GET /api/v1/previous-papers`
- `GET /api/v1/current-affairs`
- `GET /api/v1/bookmarks`
- `POST /api/v1/bookmarks/toggle`
- `GET /api/v1/notes`
- `POST /api/v1/notes`
- `PATCH /api/v1/notes/:noteId`
- `DELETE /api/v1/notes/:noteId`
- `GET /api/v1/analytics/me`
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:notificationId/read`

Current affairs and previous-paper endpoints read from the backend JSON collections. Empty collections return empty arrays; the frontend does not substitute sample records.
