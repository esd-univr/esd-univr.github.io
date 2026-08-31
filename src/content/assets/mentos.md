---
name: MentOS
summary: >-
  An educational 32-bit Linux-like operating system, published with public bachelor- and
  master-level course slides.
category: software
kind: Operating system
groups: []
order: 6
url: https://mentos-team.github.io/
repository: https://github.com/mentos-team/MentOS
licence: MIT
contact:
  person: enrico-fraccaroli
---

## An operating system small enough to read

MentOS — *Mentoring Operating System* — is an open-source educational operating system, written in C for 32-bit x86. Its stated goal is "to provide a project environment that is realistic enough to show how a real Operating System work, yet simple enough that students can understand and modify it in significant ways".

The kernel deliberately follows the guidelines defined by Linux: the same overall structure, the same vocabulary for the same concepts, and POSIX-like system calls. Together with source code the project describes as well documented throughout, and a tree that compiles quickly on a laptop, that is what keeps the exercise cycle — read, change, boot, observe — short enough to use inside a course.

## What the kernel implements

The project lists the following subsystems:

- **Processes** — `fork`, `exec`, `wait` and signals
- **Memory** — paging, a buddy system and a slab allocator
- **File systems** — a VFS layer, EXT2 and `procfs`
- **Device drivers** — keyboard, ATA, real-time clock and video
- **System calls** — more than sixty, POSIX-like
- **Inter-process communication** — semaphores, message queues and shared memory
- **Schedulers** — round-robin, priority, CFS, EDF, RM and AEDF
- **User space** — users and groups, a shell with pipes and job control, and more than forty programs

The repository also carries more than sixty test programs.

## Course material

MentOS is published together with public bachelor- and master-level course slides. They cover operating-system fundamentals and then the kernel's own modules — process management, memory management, system calls, timers and signals — with exercises such as deadlock prevention. The material is released with the code rather than kept separately.

## Who runs it

Enrico Fraccaroli is the project's manager and one of its developers, and the project names Tiziano Villa and Graziano Pravadelli as academic advisors. Its other contributors are credited in the repository, which is where that list stays current; this page does not restate it, and does not read it as a statement about CISD membership.

## Project records

- [MentOS on GitHub](https://github.com/mentos-team/MentOS)
- [Project website and course material](https://mentos-team.github.io/)
- [Wiki](https://github.com/mentos-team/MentOS/wiki)
