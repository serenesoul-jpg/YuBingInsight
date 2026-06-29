import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ruralSurveySchema = {
  questions: [
    {
      id: 'q1',
      type: 'single',
      title: '学校是否具备 AI 教学基础设备？',
      required: true,
      options: ['是', '否', '部分具备'],
    },
    {
      id: 'q2',
      type: 'scale',
      title: '学生对本学期 AI 课程的兴趣程度',
      required: true,
      min: 1,
      max: 5,
    },
    {
      id: 'q3',
      type: 'text',
      title: '课后反馈与建议',
      required: false,
    },
  ],
};

const elderSurveySchema = {
  questions: [
    {
      id: 'q1',
      type: 'single',
      title: '您是否使用过智能手机挂号？',
      required: true,
      options: ['经常使用', '偶尔使用', '从未使用'],
    },
    {
      id: 'q2',
      type: 'scale',
      title: '对手机操作的整体信心（1-5）',
      required: true,
      min: 1,
      max: 5,
    },
  ],
};

async function main() {
  const passwordHash = await bcrypt.hash('yubing2026', 10);

  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      role: 'super_admin',
    },
  });

  await prisma.siteStat.createMany({
    data: [
      { key: 'course_hours', value: 200 },
      { key: 'media_reports', value: 14 },
      { key: 'site_count', value: 6 },
      { key: 'survey_count', value: 0 },
    ],
    skipDuplicates: true,
  });

  await prisma.inviteCode.upsert({
    where: { code: 'YUBING2026' },
    update: {},
    create: {
      code: 'YUBING2026',
      role: UserRole.member,
      maxUses: 100,
    },
  });

  const courses = [
    {
      title: '编程拼图入门：无屏编程第一课',
      description: '面向乡村课堂的编程拼图入门课，含无屏操作指引。',
      category: 'puzzle',
      sortOrder: 1,
      units: [
        {
          title: '认识编程拼图',
          content: '了解编程拼图教具组成与课堂组织方式。',
          durationMin: 5,
          sortOrder: 1,
        },
        {
          title: '第一个程序',
          content: '通过拼图块完成简单指令序列。',
          durationMin: 4,
          sortOrder: 2,
        },
      ],
    },
    {
      title: '冰块机器人：情景互动课堂',
      description: '冰块机器人教具情景教案与课堂脚本示例。',
      category: 'robot',
      sortOrder: 2,
      units: [
        {
          title: '机器人初相识',
          content: '介绍冰块机器人功能与安全使用规范。',
          durationMin: 5,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'AI 素养通识：家长必读',
      description: '面向家长与老人的轻量 AI 科普。',
      category: 'literacy',
      sortOrder: 3,
      units: [
        {
          title: '什么是人工智能',
          content: '用生活案例理解 AI 是什么、能做什么。',
          durationMin: 5,
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const c of courses) {
    const existing = await prisma.course.findFirst({ where: { title: c.title } });
    if (existing) continue;

    await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        category: c.category,
        published: true,
        sortOrder: c.sortOrder,
        units: { create: c.units },
      },
    });
  }

  const surveys = [
    {
      title: '乡村学情反馈问卷',
      scene: 'rural',
      description: '教师课后学情反馈',
      schema: ruralSurveySchema,
    },
    {
      title: '老人数字能力前测',
      scene: 'community',
      description: '社区助老数字能力评估',
      schema: elderSurveySchema,
    },
  ];

  for (const s of surveys) {
    const existing = await prisma.surveyTemplate.findFirst({
      where: { title: s.title },
    });
    if (existing) continue;
    await prisma.surveyTemplate.create({
      data: { ...s, published: true },
    });
  }

  const stories = [
    {
      title: '五省六地：语冰小队田野纪实',
      summary: '实践队走进乡村、社区与文博场馆的纪实报道。',
      mediaType: 'article' as const,
      content:
        '语冰实践队以自研教具为探针，在五省六地开展 AI 普惠教学与调研……',
      published: true,
      publishedAt: new Date(),
    },
    {
      title: '200+ 课时沉淀：乡村课堂实录',
      summary: '累计 200+ 教学课时的课堂片段与成果数据。',
      mediaType: 'video' as const,
      videoUrl: '',
      published: true,
      publishedAt: new Date(),
    },
  ];

  for (const s of stories) {
    const existing = await prisma.story.findFirst({ where: { title: s.title } });
    if (existing) continue;
    await prisma.story.create({ data: s });
  }

  console.log('Seed completed. Admin: admin / yubing2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
