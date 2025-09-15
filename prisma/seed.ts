import prisma from "../src/utils/prisma";
import bcrypt from "bcrypt";
import { Role, Shift, NotificationType } from "@prisma/client";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@roster.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      name: "John Supervisor",
      email: "supervisor@roster.com",
      password: hashedPassword,
      role: Role.SUPERVISOR,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@roster.com",
      password: hashedPassword,
      role: Role.STAFF,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@roster.com",
      password: hashedPassword,
      role: Role.STAFF,
    },
  });

  const staff3 = await prisma.user.create({
    data: {
      name: "Carol Davis",
      email: "carol@roster.com",
      password: hashedPassword,
      role: Role.STAFF,
    },
  });

  console.log("👥 Created users");

  // Create duty rosters for next 7 days
  const today = new Date();
  const dutyRosters = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Morning shift
    const morningRoster = await prisma.dutyRoster.create({
      data: {
        date: date,
        shift: Shift.MORNING,
        addedById: supervisor.id,
      },
    });

    // Evening shift
    const eveningRoster = await prisma.dutyRoster.create({
      data: {
        date: date,
        shift: Shift.EVENING,
        addedById: supervisor.id,
      },
    });

    // Night shift (only for some days)
    if (i % 2 === 0) {
      const nightRoster = await prisma.dutyRoster.create({
        data: {
          date: date,
          shift: Shift.NIGHT,
          addedById: admin.id,
        },
      });
      dutyRosters.push(nightRoster);
    }

    dutyRosters.push(morningRoster, eveningRoster);
  }

  console.log("📅 Created duty rosters");

  // Create assignments
  const staffMembers = [staff1, staff2, staff3];
  const assignments = [];

  for (let i = 0; i < dutyRosters.length; i++) {
    const roster = dutyRosters[i];
    const assignedStaff = staffMembers[i % staffMembers.length];

    const assignment = await prisma.assignment.create({
      data: {
        dutyRosterId: roster.id,
        userId: assignedStaff.id,
        assignedById: supervisor.id,
      },
    });

    assignments.push(assignment);
  }

  console.log("📋 Created assignments");

  // Create notifications
  const notifications = await Promise.all([
    // Welcome notifications for all staff
    prisma.notification.create({
      data: {
        userId: staff1.id,
        title: "Welcome to Roster System",
        message:
          "Welcome to the duty roster management system. Check your assignments regularly.",
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        metadata: JSON.stringify({ isWelcome: true }),
      },
    }),

    prisma.notification.create({
      data: {
        userId: staff2.id,
        title: "Welcome to Roster System",
        message:
          "Welcome to the duty roster management system. Check your assignments regularly.",
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        metadata: JSON.stringify({ isWelcome: true }),
      },
    }),

    // Assignment notifications
    prisma.notification.create({
      data: {
        userId: staff1.id,
        title: "New Assignment",
        message: `You have been assigned to ${
          assignments[0]?.dutyRosterId || "MORNING"
        } shift`,
        type: NotificationType.ASSIGNMENT_CREATED,
        metadata: JSON.stringify({ assignmentId: assignments[0]?.id }),
      },
    }),

    prisma.notification.create({
      data: {
        userId: staff2.id,
        title: "Shift Reminder",
        message: "Don't forget about your upcoming shift tomorrow morning",
        type: NotificationType.REMINDER,
        metadata: JSON.stringify({
          shiftDate: new Date(Date.now() + 86400000),
        }),
      },
    }),

    // System announcements
    prisma.notification.create({
      data: {
        userId: admin.id,
        title: "System Maintenance",
        message:
          "Scheduled maintenance will occur this weekend from 2 AM to 4 AM",
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        metadata: JSON.stringify({
          maintenanceStart: "2025-12-21T02:00:00Z",
          maintenanceEnd: "2025-12-21T04:00:00Z",
        }),
      },
    }),
  ]);

  console.log("🔔 Created notifications");

  console.log("✅ Database seeded successfully!");
  console.log("\n📊 Seeded data summary:");
  console.log(`- Users: 5 (1 admin, 1 supervisor, 3 staff)`);
  console.log(`- Duty Rosters: ${dutyRosters.length}`);
  console.log(`- Assignments: ${assignments.length}`);
  console.log(`- Notifications: ${notifications.length}`);

  console.log("\n🔑 Test credentials:");
  console.log("Admin: admin@roster.com / password123");
  console.log("Supervisor: supervisor@roster.com / password123");
  console.log("Staff: alice@roster.com / password123");
  console.log("Staff: bob@roster.com / password123");
  console.log("Staff: carol@roster.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
