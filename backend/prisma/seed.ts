import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('password123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@scholarflow.com' },
    update: {},
    create: {
      email: 'demo@scholarflow.com',
      passwordHash: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('👤 Created demo user:', demoUser.email);

  // Create sample projects
  const workProject = await prisma.project.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      userId: demoUser.id,
      name: '工作项目',
      color: '#E6A05D',
      description: '日常工作任务',
    },
  });

  const personalProject = await prisma.project.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      userId: demoUser.id,
      name: '个人发展',
      color: '#4A4238',
      description: '学习和成长任务',
    },
  });

  console.log('📁 Created sample projects');

  // Create sample tasks (without projects for now)
  const taskData = [
    {
      userId: demoUser.id,
      title: '查看并回复昨日积压邮件',
      priority: 'HIGH' as const,
      completed: true,
      scheduledTime: '09:00',
      duration: 30,
      category: '工作',
      tags: JSON.stringify(['邮件', '沟通']),
    },
    {
      userId: demoUser.id,
      title: '完成市场评估报告及数据校验',
      priority: 'HIGH' as const,
      completed: true,
      scheduledTime: '10:00',
      duration: 120,
      category: '工作',
      tags: JSON.stringify(['报告', '数据分析']),
    },
    {
      userId: demoUser.id,
      title: '项目进度同步周会',
      priority: 'MEDIUM' as const,
      completed: true,
      scheduledTime: '14:30',
      duration: 60,
      category: '会议',
      tags: JSON.stringify(['会议', '进度同步']),
    },
    {
      userId: demoUser.id,
      title: '前往银行办理企业账户业务',
      priority: 'MEDIUM' as const,
      completed: false,
      scheduledTime: '16:00',
      duration: 45,
      category: '行政',
      tags: JSON.stringify(['银行', '行政']),
    },
    {
      userId: demoUser.id,
      title: '阅读2章《大法官金斯伯格》',
      priority: 'LOW' as const,
      completed: false,
      category: '学习',
      tags: JSON.stringify(['阅读', '传记']),
    },
    {
      userId: demoUser.id,
      title: '为家中猫咪购置自动喂食器',
      priority: 'MEDIUM' as const,
      completed: false,
      category: '生活',
      tags: JSON.stringify(['购物', '宠物']),
    },
    {
      userId: demoUser.id,
      title: '瑜伽冥想与拉伸训练',
      priority: 'MEDIUM' as const,
      completed: false,
      category: '健康',
      tags: JSON.stringify(['运动', '冥想']),
    },
    {
      userId: demoUser.id,
      title: '周末观影计划：奥本海默',
      priority: 'LOW' as const,
      completed: false,
      category: '娱乐',
      tags: JSON.stringify(['电影', '周末']),
    },
  ];

  const createdTasks = [];
  for (const data of taskData) {
    const task = await prisma.task.create({
      data: data,
    });
    createdTasks.push(task);
  }

  // Create task-project relationships
  const taskProjectRelations = [
    { taskId: createdTasks[0].id, projectId: workProject.id },
    { taskId: createdTasks[1].id, projectId: workProject.id },
    { taskId: createdTasks[2].id, projectId: workProject.id },
    { taskId: createdTasks[3].id, projectId: workProject.id },
    { taskId: createdTasks[4].id, projectId: personalProject.id },
    { taskId: createdTasks[6].id, projectId: personalProject.id },
  ];

  for (const relation of taskProjectRelations) {
    await prisma.taskProject.create({
      data: relation,
    });
  }

  console.log('✅ Created sample tasks');

  // Create sample mood entries
  const moodEntries = [
    {
      userId: demoUser.id,
      mood: 'Energetic',
      emoji: '☀️',
      note: '今天状态很好，完成了很多任务',
      date: new Date(),
    },
    {
      userId: demoUser.id,
      mood: 'Happy',
      emoji: '😊',
      note: '周末休息得不错',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  ];

  for (const moodData of moodEntries) {
    await prisma.moodEntry.create({
      data: moodData,
    });
  }

  console.log('😊 Created sample mood entries');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
