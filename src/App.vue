<template>
  <div class="coursepage">
    <!-- ── Course-scoped sidebar ─────────────────────────────
         Global chrome (brand, main nav, footer) belongs to the shell.
         This sidebar only makes sense inside a course, so the remote
         owns it. -->
    <aside class="csidebar">
      <article class="ccard">
        <div class="ccard__cover">
          <span class="ccard__cover-tag">{{ course.framework }}</span>
        </div>
        <div class="ccard__body">
          <h1 class="ccard__title">{{ course.title }}</h1>
          <p class="ccard__tagline">{{ course.tagline }}</p>
        </div>
      </article>

      <section class="cprogress">
        <p class="cprogress__label">Your progress</p>
        <p class="cprogress__value">
          {{ course.progress }}<span class="cprogress__unit">% done</span>
        </p>

        <div
          class="progressbar"
          role="progressbar"
          :aria-valuenow="course.progress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span class="progressbar__fill" :style="{ width: course.progress + '%' }"></span>
        </div>

        <dl class="cprogress__meta">
          <div class="cprogress__row">
            <dt><span class="cprogress__flame" aria-hidden="true">▲</span> Streak</dt>
            <dd>{{ course.streak }} days</dd>
          </div>
          <div class="cprogress__row">
            <dt>Lessons</dt>
            <dd>{{ completedLessons }} / {{ course.totalLessons }}</dd>
          </div>
        </dl>
      </section>

      <nav class="ctabs" aria-label="Course sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ctabs__item"
          :class="{ 'is-active': activeTab === tab.id }"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          type="button"
          @click="activeTab = tab.id"
        >
          <span class="ctabs__icon" aria-hidden="true">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </aside>

    <!-- ── Main ──────────────────────────────────────────────── -->
    <main class="cmain">
      <header class="cmain__head">
        <p class="cmain__chips">
          <span class="tag tag--react">{{ course.framework }}</span>
          <span class="cmain__chip">{{ course.level }}</span>
          <span class="cmain__chip">{{ course.totalLessons }} lessons</span>
        </p>

        <button class="btn btn--primary" type="button" @click="resume">
          Continue <span aria-hidden="true">→</span>
        </button>
      </header>

      <!-- Overview -->
      <section v-if="activeTab === 'overview'" class="panel">
        <h2 class="panel__title">Course overview</h2>
        <p class="panel__lead">{{ course.description }}</p>

        <div class="outcomes">
          <div class="outcomes__head">
            <h3 class="outcomes__title">What you'll learn</h3>
            <span class="outcomes__count">{{ course.outcomes.length }} outcomes</span>
          </div>
          <ul class="outcomes__list">
            <li v-for="o in course.outcomes" :key="o" class="outcomes__item">
              <span class="outcomes__check" aria-hidden="true">✓</span>{{ o }}
            </li>
          </ul>
        </div>

        <div class="modules">
          <div class="modules__head">
            <h3 class="modules__title">{{ currentModule.name }}</h3>
            <span class="modules__count">
              {{ moduleDoneCount }} / {{ currentModule.lessons.length }}
            </span>
          </div>

          <ul class="modules__list">
            <li v-for="lesson in currentModule.lessons" :key="lesson.id">
              <div class="lrow" :class="{ 'lrow--done': lesson.done, 'lrow--current': lesson.current }">
                <span class="lrow__mark" aria-hidden="true">
                  {{ lesson.done ? '✓' : (lesson.current ? '◐' : '○') }}
                </span>
                <span class="lrow__title">{{ lesson.title }}</span>

                <span v-if="lesson.done" class="lrow__state">Done</span>
                <button
                  v-else-if="lesson.current"
                  class="btn btn--warm btn--sm"
                  type="button"
                  @click="resume"
                >
                  Resume
                </button>
                <span v-else class="lrow__state lrow__state--locked">Locked</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Lessons -->
      <section v-else-if="activeTab === 'lessons'" class="panel">
        <h2 class="panel__title">All lessons</h2>
        <p class="panel__lead">Every lesson in this course, in order.</p>

        <div v-for="mod in course.modules" :key="mod.name" class="modules">
          <div class="modules__head">
            <h3 class="modules__title">{{ mod.name }}</h3>
            <span class="modules__count">{{ mod.lessons.length }} lessons</span>
          </div>
          <ul class="modules__list">
            <li v-for="lesson in mod.lessons" :key="lesson.id">
              <div class="lrow" :class="{ 'lrow--done': lesson.done, 'lrow--current': lesson.current }">
                <span class="lrow__mark" aria-hidden="true">
                  {{ lesson.done ? '✓' : (lesson.current ? '◐' : '○') }}
                </span>
                <span class="lrow__title">{{ lesson.title }}</span>
                <span class="lrow__state">{{ lesson.minutes }} min</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Syllabus -->
      <section v-else-if="activeTab === 'syllabus'" class="panel">
        <h2 class="panel__title">Syllabus</h2>
        <p class="panel__lead">
          The concepts this course covers, and where each one is applied.
        </p>
        <ul class="syllabus">
          <li v-for="(item, i) in course.syllabus" :key="item.topic" class="syllabus__item">
            <span class="syllabus__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <p class="syllabus__topic">{{ item.topic }}</p>
              <p class="syllabus__where">{{ item.where }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Resources -->
      <section v-else class="panel">
        <h2 class="panel__title">Resources</h2>
        <p class="panel__lead">Reference material to use alongside the lessons.</p>
        <ul class="reslist">
          <li v-for="r in course.resources" :key="r.title" class="reslist__item">
            <span class="reslist__kind">{{ r.kind }}</span>
            <span class="reslist__title">{{ r.title }}</span>
          </li>
        </ul>
      </section>

      <p class="origin">Vue remote &middot; mounted at runtime by the React shell</p>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CourseOverview',

  data() {
    return {
      activeTab: 'overview',

      tabs: [
        { id: 'overview', label: 'Overview', icon: '▤' },
        { id: 'lessons', label: 'Lessons', icon: '≡' },
        { id: 'syllabus', label: 'Syllabus', icon: '◫' },
        { id: 'resources', label: 'Resources', icon: '⚑' },
      ],

      course: {
        framework: 'React',
        level: 'Beginner',
        title: 'Intro to React',
        tagline: 'Build UIs from components up',
        progress: 42,
        streak: 6,
        totalLessons: 12,
        description:
          'A hands-on introduction to building interfaces with React. Start from ' +
          'components and props, then work up to state and effects through short, ' +
          'practical lessons.',
        outcomes: [
          'Build components with JSX',
          'Pass and read props',
          'Manage state with hooks',
          'Handle events & forms',
        ],
        modules: [
          {
            name: 'Module 1 · Fundamentals',
            lessons: [
              { id: 1, title: 'What is React?', done: true, minutes: 8 },
              { id: 2, title: 'Your first component', done: true, minutes: 12 },
              { id: 3, title: 'JSX in depth', done: true, minutes: 10 },
              { id: 4, title: 'Rendering lists', done: true, minutes: 9 },
              { id: 5, title: 'Conditional rendering', done: true, minutes: 11 },
            ],
          },
          {
            name: 'Module 2 · Components & props',
            lessons: [
              { id: 6, title: 'Components & props', current: true, minutes: 15 },
              { id: 7, title: 'Composition patterns', minutes: 14 },
              { id: 8, title: 'Prop types & defaults', minutes: 10 },
            ],
          },
          {
            name: 'Module 3 · State & effects',
            lessons: [
              { id: 9, title: 'useState', minutes: 13 },
              { id: 10, title: 'useEffect', minutes: 16 },
              { id: 11, title: 'Handling events', minutes: 11 },
              { id: 12, title: 'Forms & inputs', minutes: 14 },
            ],
          },
        ],
        syllabus: [
          { topic: 'Components', where: 'Applied in the course card and lesson layout' },
          { topic: 'Props', where: 'Applied throughout the dashboard grid' },
          { topic: 'State', where: 'Applied in the lesson task list' },
          { topic: 'Effects', where: 'Applied when loading course data' },
          { topic: 'Events', where: 'Applied in every interactive control' },
        ],
        resources: [
          { kind: 'Docs', title: 'React reference — components and props' },
          { kind: 'Cheatsheet', title: 'JSX syntax quick reference' },
          { kind: 'Exercise', title: 'Build a Badge component from scratch' },
          { kind: 'Reading', title: 'Thinking in components' },
        ],
      },
    };
  },

  computed: {
    completedLessons() {
      return this.course.modules
        .flatMap((m) => m.lessons)
        .filter((l) => l.done).length;
    },

    currentModule() {
      return (
        this.course.modules.find((m) => m.lessons.some((l) => l.current)) ||
        this.course.modules[0]
      );
    },

    moduleDoneCount() {
      return this.currentModule.lessons.filter((l) => l.done).length;
    },
  },

  methods: {
    /**
     * Navigate to the lesson.
     *
     * The lesson lives in a different remote and the shell owns routing, so
     * this remote cannot call the router directly without depending on it.
     * Instead it announces intent on a custom DOM event; the shell listens
     * and routes. Served standalone there is no listener, so the call is a
     * no-op rather than an error.
     */
    resume() {
      window.dispatchEvent(
        new CustomEvent('amor:navigate', { detail: { to: '/lesson' } })
      );
    },
  },
};
</script>