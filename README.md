# Todo List Application

## 🚀 프로젝트 소개

프로젝트는 React와 TypeScript를 활용한 현대적인 Todo List 애플리케이션입니다. 드래그 앤 드롭 기능을 포함한 직관적인 사용자 인터페이스를 제공하여 할 일 목록을 효율적으로 관리할 수 있습니다.

## ✨ 주요 기능

- 새로운 Board 생성, 수정, 삭제 처리
- Todo 항목 생성, 수정, 삭제, 완료 처리
- 드래그 앤 드롭으로 Board, Todo 항목 순서 변경
- 반응형 디자인

## 🛠 기술 스택

### Frontend

- **React 18**: 사용자 인터페이스 구축
- **TypeScript**: 정적 타입 지원으로 안정적인 코드 작성
- **Tailwind CSS**: 모던하고 반응형인 UI 스타일링
- **@hello-pangea/dnd**: 드래그 앤 드롭 기능 구현
- **@heroicons/react**: 아이콘 컴포넌트

## 💡 주요 기능 문제 해결 방안

### 1. Board 관리 기능

- **Board CRUD 구현**:

  ```typescript
  type BoardType = {
    id: string;
    title: string;
    todos: TodoType[];
    createdAt: string;
  };
  ```

  - UUID를 활용한 고유 식별자 생성
  - Board 컴포넌트의 상태 관리를 위한 useState 훅 활용
  - 부모-자식 컴포넌트 간 데이터 전달을 위한 props 활용

- **Board 드래그 앤 드롭**:
  - DragDropContext와 Droppable 컴포넌트를 활용한 드래그 영역 설정
  - onDragEnd 이벤트 핸들러를 통한 Board 위치 업데이트

### 2. Todo 항목 관리

- **Todo CRUD 구현**:

  ```typescript
  type TodoType = {
    id: string;
    content: string;
    completed: boolean;
    createdAt: string;
  };
  ```

  - UUID를 활용한 고유 식별자 생성
  - 체크박스를 통한 완료 상태 토글
  - 수정 모드 전환을 위한 isEditing 상태 관리
  - 인라인 편집을 위한 controlled input 구현

- **Todo 드래그 앤 드롭**:
  - Draggable 컴포넌트를 활용한 개별 Todo 아이템 드래그 기능
  - Board 내부 및 Board 간 이동 로직 구현

### 3. 사용자 인터랙션

- **키보드 접근성**:

  ```typescript
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedContent(content);
      setIsEditing(false);
    }
  };
  ```

  - Enter 키를 통한 저장 기능
  - Escape 키를 통한 편집 취소

- **실시간 수정**:
  - onBlur 이벤트를 통한 자동 저장

### 4. UI/UX 최적화

- **시각적 피드백**:
  - 드래그 앤 드롭 시 아이템 위치 표시
  - 완료된 Todo 항목의 시각적 구분
