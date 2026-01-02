import { z } from 'zod';

/**
 * 🍄 DATABASE TRACER + 🌊 TRANSPORTER
 * 
 * All database operations MUST go through these wrappers.
 * Provides:
 * - Runtime validation (Zod)
 * - Error tracing (exactly where it failed)
 * - Logging (what data is being transported)
 * - Type safety (TypeScript + Zod)
 * 
 * Usage:
 *   DB.AUTH(schema, data, (validated) => dbOperation(validated))
 *   DB.READ(() => dbOperation())
 *   DB.WRITE(() => dbOperation())
 */

class DB_Tracer {
  /**
   * 🍄 AUTH - Authentication operations with validation
   */
  async AUTH<T extends z.ZodType>(
    schema: T,
    data: z.infer<T>,
    fn: (validated: z.infer<T>) => Promise<any>
  ): Promise<any> {
    console.log('🍄 AUTH tracer -> validating input');
    
    let validated: z.infer<T>;
    try {
      validated = schema.parse(data);
    } catch (err: any) {
      console.error('🌊 Transport BLOCKED at AUTH validation:', err.errors || err);
      throw new Error(`🌊 AUTH validation failed: ${err.message}`);
    }
    
    console.log('🌊 AUTH -> transporting validated data:', { 
      ...validated, 
      password: validated.password ? '***' : undefined
    });
    
    try {
      const result = await fn(validated);
      console.log('✅ AUTH transport complete');
      return result;
    } catch (err: any) {
      console.error('🌊 Transport BLOCKED at AUTH operation:', err.message || err);
      throw err;
    }
  }

  /**
   * 🍄 READ - Database read operations
   */
  async READ<T>(fn: () => Promise<T>): Promise<T> {
    console.log('🍄 READ tracer -> transporting');
    
    try {
      const result = await fn();
      console.log('✅ READ transport complete');
      return result;
    } catch (err: any) {
      console.error('🌊 Transport BLOCKED at READ operation:', err.message || err);
      throw err;
    }
  }

  /**
   * 🍄 WRITE - Database write operations
   */
  async WRITE<T>(fn: () => Promise<T>): Promise<T> {
    console.log('🍄 WRITE tracer -> transporting');
    
    try {
      const result = await fn();
      console.log('✅ WRITE transport complete');
      return result;
    } catch (err: any) {
      console.error('🌊 Transport BLOCKED at WRITE operation:', err.message || err);
      throw err;
    }
  }
}

// Export as DB (mushroom 🍄 in spirit, not in code)
export const DB = new DB_Tracer();
