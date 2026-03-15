interface Course {
  id: string
  name: string
  code: string | null
  color: string
}

interface CourseSelectorProps {
  courses: Course[]
  selectedId: string | null
  onChange: (id: string | null) => void
}

export function CourseSelector({ courses, selectedId, onChange }: CourseSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
          selectedId === null
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
        }`}
      >
        All courses
      </button>

      {courses.map(course => (
        <button
          key={course.id}
          onClick={() => onChange(course.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            selectedId === course.id
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedId === course.id ? 'white' : course.color }}
          />
          {course.code ?? course.name}
        </button>
      ))}
    </div>
  )
}