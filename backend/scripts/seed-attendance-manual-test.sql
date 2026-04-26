-- =============================================================================
-- Проверочный SQL для attendance учителя
--
-- Входные данные (как у вас):
--   teacher: users.id = 1, email = 'a@gmail.com'
--   parent1: users.id = 2
--   parent2: users.id = 3
--
-- Что делает скрипт:
--   1) гарантирует роль TEACHER у user 1,
--   2) создает/переиспользует группу учителя,
--   3) находит детей родителей 2 и 3,
--   4) назначает этих детей в группу учителя,
--   5) (опционально) добавляет тестовые attendance записи.
--
-- Важно про таблицу группы:
--   - актуальная таблица: kindergarten_group
--   - она появляется миграцией V20260415_161000 (rename "group" -> kindergarten_group)
-- =============================================================================

BEGIN;

-- 0) Проверка, что у учителя есть tenant
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = 1
          AND u.email = 'a@gmail.com'
          AND u.tenant_id IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'User id=1 (a@gmail.com) not found or tenant_id is NULL';
    END IF;
END $$;

-- 1) Роль TEACHER для user 1
INSERT INTO user_roles (user_id, role_id)
SELECT 1, r.id
FROM roles r
WHERE r.name = 'TEACHER'
ON CONFLICT DO NOTHING;

-- 2) Создаем группу для учителя, если у него еще нет активной
INSERT INTO kindergarten_group (tenant_id, name, age_range, teacher_user_id)
SELECT u.tenant_id, 'Teacher 1 Attendance Group', '3-6', u.id
FROM users u
WHERE u.id = 1
  AND NOT EXISTS (
      SELECT 1
      FROM kindergarten_group g
      WHERE g.teacher_user_id = u.id
        AND g.deleted_at IS NULL
  );

-- 3) Назначаем в группу учителя детей родителей id=2 и id=3
WITH teacher_group AS (
    SELECT g.id AS group_id, g.tenant_id
    FROM kindergarten_group g
    WHERE g.teacher_user_id = 1
      AND g.deleted_at IS NULL
    ORDER BY g.id
    LIMIT 1
),
parent_children AS (
    -- Основной источник связей
    SELECT DISTINCT cp.child_id
    FROM child_parent cp
    JOIN teacher_group tg ON tg.tenant_id = cp.tenant_id
    WHERE cp.parent_user_id IN (2, 3)
      AND cp.deleted_at IS NULL

    UNION

    -- Резервный источник (если связь хранится в child.parent_id)
    SELECT DISTINCT c.id
    FROM child c
    JOIN teacher_group tg ON tg.tenant_id = c.tenant_id
    WHERE c.parent_id IN (2, 3)
      AND c.deleted_at IS NULL
)
UPDATE child c
SET group_id = tg.group_id
FROM teacher_group tg
JOIN parent_children pc ON TRUE
WHERE c.tenant_id = tg.tenant_id
  AND c.id = pc.child_id
  AND c.deleted_at IS NULL;

-- 4) Опционально: добавим по одной attendance записи для найденных детей
INSERT INTO attendance (tenant_id, child_id, date, status)
SELECT c.tenant_id,
       c.id,
       CURRENT_DATE,
       CASE WHEN c.id % 2 = 0 THEN 'PRESENT'::attendance_status ELSE 'ABSENT'::attendance_status END
FROM child c
JOIN kindergarten_group g ON g.id = c.group_id
WHERE g.teacher_user_id = 1
  AND c.deleted_at IS NULL
  AND c.id IN (
      SELECT DISTINCT cp.child_id
      FROM child_parent cp
      WHERE cp.parent_user_id IN (2, 3)
        AND cp.deleted_at IS NULL
      UNION
      SELECT c2.id
      FROM child c2
      WHERE c2.parent_id IN (2, 3)
        AND c2.deleted_at IS NULL
  )
ON CONFLICT (child_id, date) DO NOTHING;

COMMIT;

-- =============================================================================
-- Проверки после выполнения (запустите отдельно):
-- =============================================================================
-- SELECT * FROM kindergarten_group WHERE teacher_user_id = 1 AND deleted_at IS NULL;
--
-- SELECT c.id, c.first_name, c.last_name, c.group_id, g.name AS group_name
-- FROM child c
-- LEFT JOIN kindergarten_group g ON g.id = c.group_id
-- WHERE c.deleted_at IS NULL
--   AND (
--      c.id IN (SELECT child_id FROM child_parent WHERE parent_user_id IN (2,3) AND deleted_at IS NULL)
--      OR c.parent_id IN (2,3)
--   );
--
-- SELECT a.id, a.child_id, a.date, a.status
-- FROM attendance a
-- WHERE a.date = CURRENT_DATE
-- ORDER BY a.child_id;
