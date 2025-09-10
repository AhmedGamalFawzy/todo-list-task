# Senior Frontend Developer Interview - Code Refactoring Task

## Scenario

You've just joined a team that has been working on a Todo List application. The previous developer left, and you've been asked to take over the codebase. While the application works, it has several code quality issues that need to be addressed before it can be maintained and extended by the team.

## Current State

- ✅ Application is functional - all features work as expected
- ❌ Code quality is poor and violates many best practices
- ❌ Difficult to maintain and extend
- ❌ Performance could be better
- ❌ Not following React/TypeScript conventions

## Your Mission

Refactor this codebase to make it production-ready while maintaining all existing functionality.

## Key Areas of Focus

### 1. **Component Architecture**

The current `App.tsx` is a 500+ line monolith. Break it down into:

- Smaller, focused components
- Custom hooks for business logic
- Proper separation of concerns
- Reusable components

### 2. **Code Quality Issues**

Fix violations of:

- **SOLID Principles**: Single Responsibility, Open/Closed, etc.
- **DRY**: Remove duplicate code (validation, localStorage, styling)
- **KISS**: Simplify overly complex logic
- **YAGNI**: Remove unnecessary features and over-engineering

### 3. **TypeScript & React Best Practices**

- Fix TypeScript errors and improve type safety
- Optimize component re-renders
- Implement proper error handling
- Use appropriate React patterns

### 4. **Performance & UX**

- Reduce unnecessary re-renders
- Improve loading states
- Add proper error boundaries
- Enhance accessibility

## Specific Problems to Solve

### Critical Issues (Must Fix)

1. **Monolithic Component**: App.tsx does everything
2. **Duplicate Code**: Same logic repeated multiple times
3. **Poor Type Safety**: Using `any` types and missing interfaces
4. **Complex State Management**: Too many useState hooks
5. **Violation of React Rules**: Effects and state updates

### Important Issues (Should Fix)

1. **Over-Engineering**: Unnecessary features like time tracking
2. **Poor Error Handling**: Silent failures and poor UX
3. **Accessibility**: Missing ARIA labels and keyboard navigation
4. **Performance**: Inefficient filtering and sorting

### Nice to Have (Bonus Points)

1. **Testing**: Add unit tests for critical functions
2. **Documentation**: Improve code comments and documentation
3. **Advanced Patterns**: Implement advanced React patterns appropriately

## Success Criteria

### Minimum Requirements

- [ ] Application still works exactly the same
- [ ] Code is broken into logical components
- [ ] No duplicate code
- [ ] TypeScript errors are fixed
- [ ] Components have single responsibilities

### Good Refactoring

- [ ] Custom hooks for business logic
- [ ] Proper error handling
- [ ] Performance optimizations
- [ ] Clean, readable code
- [ ] Good component organization

### Excellent Refactoring

- [ ] Comprehensive testing
- [ ] Advanced React patterns used appropriately
- [ ] Accessibility improvements
- [ ] Documentation and comments
- [ ] Scalable architecture

## Getting Started

1. **Explore the Current Code**

   ```bash
   npm run dev
   ```

   Test all functionality to understand what the app does.

2. **Check Code Quality**

   ```bash
   npm run lint
   ```

   See the current linting errors.

3. **Plan Your Refactoring**

   - Identify the main problems
   - Plan your component structure
   - Decide on your approach

4. **Refactor Incrementally**
   - Make small, focused changes
   - Test frequently
   - Commit often (if using git)

## Time Guidelines

- **2-3 hours**: Basic refactoring (minimum requirements)
- **4-5 hours**: Good refactoring (recommended)
- **6+ hours**: Excellent refactoring (bonus territory)

## Tips for Success

### Do:

- ✅ Keep the application functional throughout
- ✅ Focus on code quality over new features
- ✅ Use proper TypeScript types
- ✅ Write clean, readable code
- ✅ Test your changes frequently

### Don't:

- ❌ Add new features (focus on refactoring)
- ❌ Change the visual design
- ❌ Break existing functionality
- ❌ Over-engineer solutions
- ❌ Install unnecessary dependencies

## What We're Evaluating

1. **Problem Identification** (25%)

   - Can you identify the main issues?
   - Do you understand why they're problems?
   - Can you prioritize fixes appropriately?

2. **Technical Skills** (35%)

   - React and TypeScript proficiency
   - Understanding of best practices
   - Code organization and architecture
   - Performance considerations

3. **Code Quality** (25%)

   - Clean, readable code
   - Proper abstraction levels
   - Consistent patterns
   - Good naming conventions

4. **Problem-Solving Approach** (15%)
   - Systematic approach to refactoring
   - Incremental improvements
   - Testing and validation
   - Documentation of changes

## Deliverables

When you're done, please provide:

1. **Refactored Code**: The improved codebase
2. **Summary Document**: Brief explanation of:
   - Main problems you identified
   - Key changes you made
   - Your reasoning for architectural decisions
   - What you would do next with more time

## Questions?

If you need clarification on any requirements or have questions about the current functionality, please ask!

Good luck! 🚀
