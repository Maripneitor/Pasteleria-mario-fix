const { SystemLog } = require('../models');

class LoggerService {
    /**
     * Log an informational event
     */
    static async info(section, message, meta = {}) {
        return this.log('info', section, message, meta);
    }

    /**
     * Log a warning event
     */
    static async warn(section, message, meta = {}) {
        return this.log('warn', section, message, meta);
    }

    /**
     * Log an error event
     */
    static async error(section, message, meta = {}) {
        return this.log('error', section, message, meta);
    }

    /**
     * Log a security event
     */
    static async security(section, message, meta = {}) {
        return this.log('security', section, message, meta);
    }

    /**
     * Core log function
     */
    static async log(level, section, message, meta = {}) {
        // En desarrollo, también mostramos en consola
        if (process.env.NODE_ENV !== 'production') {
            const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
            console.log(`${color}[${level.toUpperCase()}] [${section}] ${message}\x1b[0m`, meta);
        }

        try {
            await SystemLog.create({
                level,
                section,
                message,
                meta
            });
        } catch (err) {
            console.error("❌ FAILED TO WRITE SYSTEM LOG:", err);
            // Non-blocking logging failure
        }
    }
}

module.exports = LoggerService;
