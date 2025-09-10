# Senior Frontend Developer Interview Task

## Overview

This is a functional Todo List application built with Vite, React, and TypeScript. While the application works correctly, it has been intentionally written with poor code quality to test your ability to identify and fix common code quality issues.

## Your Task

Your goal is to refactor this codebase to follow best practices and clean code principles. The application should maintain its current functionality while improving code quality, maintainability, and performance.

## Current Issues to Address

### 1. SOLID Principles Violations

- **Single Responsibility Principle (SRP)**: The main App component handles too many responsibilities
- **Open/Closed Principle (OCP)**: Code is not easily extensible without modification
- **Liskov Substitution Principle (LSP)**: Poor abstraction and interface design
- **Interface Segregation Principle (ISP)**: Overly broad interfaces
- **Dependency Inversion Principle (DIP)**: High coupling and poor abstraction

### 2. DRY (Don't Repeat Yourself) Violations

- Duplicate validation logic
- Repeated localStorage operations
- Duplicate styling patterns
- Redundant state management logic

### 3. KISS (Keep It Simple, Stupid) Violations

- Overly complex priority calculation
- Unnecessary complex filtering and sorting logic
- Complicated component structure
- Over-engineered features

### 4. YAGNI (You Aren't Gonna Need It) Violations

- Unnecessary features like time tracking, assignees, descriptions
- Overly complex statistics
- Unused internationalization
- Excessive metadata and badges

### 5. Additional Code Quality Issues

- Poor component organization
- Lack of proper TypeScript typing
- No custom hooks for reusable logic
- Poor error handling
- Inefficient re-renders
- Accessibility issues
- No proper separation of concerns

## What We're Looking For

### Code Organization

- [ ] Break down the monolithic App component into smaller, focused components
- [ ] Create custom hooks for business logic
- [ ] Implement proper separation of concerns
- [ ] Use appropriate design patterns

### Clean Code Practices

- [ ] Follow SOLID principles
- [ ] Eliminate code duplication (DRY)
- [ ] Simplify complex logic (KISS)
- [ ] Remove unnecessary features (YAGNI)
- [ ] Improve naming conventions
- [ ] Add proper error handling

### React Best Practices

- [ ] Optimize component re-renders
- [ ] Use proper state management
- [ ] Implement proper prop drilling solutions
- [ ] Use React patterns appropriately
- [ ] Handle side effects properly

### TypeScript Usage

- [ ] Create proper type definitions
- [ ] Use discriminated unions where appropriate
- [ ] Implement proper generic types
- [ ] Remove any `any` types
- [ ] Use proper interface design

### Performance & Accessibility

- [ ] Optimize rendering performance
- [ ] Add proper accessibility attributes
- [ ] Implement keyboard navigation
- [ ] Ensure responsive design
- [ ] Add proper focus management

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Run ESLint to see current issues:
   \`\`\`bash
   npm run lint
   \`\`\`

4. Run the application and test its functionality before refactoring

## Evaluation Criteria

### Code Quality (40%)

- Adherence to SOLID principles
- Elimination of code duplication
- Simplification of complex logic
- Proper error handling
- Clean, readable code

### Architecture & Design (30%)

- Component organization and structure
- Separation of concerns
- Use of appropriate design patterns
- Proper abstraction levels
- Scalable architecture

### React & TypeScript Proficiency (20%)

- Proper use of React hooks and patterns
- TypeScript best practices
- Performance optimizations
- State management
- Component lifecycle handling

### Problem-Solving Approach (10%)

- Systematic approach to refactoring
- Identification of root causes
- Prioritization of improvements
- Documentation of changes
- Testing considerations

## Deliverables

1. **Refactored Code**: Clean, well-organized codebase following best practices
2. **Documentation**: Brief explanation of major changes made
3. **Testing**: Ensure all functionality still works after refactoring

## Time Expectations

- **Minimum**: 2-3 hours for basic refactoring
- **Recommended**: 4-6 hours for comprehensive improvements
- **Maximum**: 8 hours (don't over-engineer)

## Bonus Points

- Add unit tests for critical functionality
- Implement proper error boundaries
- Add loading states and optimistic updates
- Improve accessibility beyond basic requirements
- Add proper form validation
- Implement proper data persistence patterns

## Notes

- You may install additional dependencies if needed (but avoid unnecessary libraries)
- Focus on code quality over new features
- Document your reasoning for major architectural decisions
- Consider how your changes improve maintainability and scalability

## Questions?

If you have any questions about the requirements or need clarification, please ask. Good luck!

---

**Remember**: This is not about showing off with complex patterns or frameworks. We want to see your ability to write clean, maintainable, and well-structured code that follows established best practices.
