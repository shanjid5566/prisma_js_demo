const fs = require('fs');
const path = require('path');

/**
 * Logger Service
 * Stores logs in memory and persists them to logs/app.log
 */
class LoggerService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this._ensureLogDir();
    this._loadFromFile();
  }

  _ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  _loadFromFile() {
    if (!fs.existsSync(this.logFile)) {
      return;
    }

    try {
      const content = fs.readFileSync(this.logFile, 'utf8');
      const entries = content
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      this.logs = entries.slice(-this.maxLogs);
    } catch (error) {
      console.error('Failed to load logs from file:', error.message);
    }
  }

  _persistLog(entry) {
    fs.appendFile(this.logFile, `${JSON.stringify(entry)}\n`, () => {});
  }

  _addLog(level, message, metadata = {}) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this._persistLog(entry);
    return entry;
  }

  info(message, metadata = {}) {
    return this._addLog('info', message, metadata);
  }

  warn(message, metadata = {}) {
    return this._addLog('warn', message, metadata);
  }

  error(message, metadata = {}) {
    return this._addLog('error', message, metadata);
  }

  getAllLogs({ level, limit = 100, offset = 0 } = {}) {
    let filtered = [...this.logs];

    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }

    const total = filtered.length;
    const data = filtered
      .slice()
      .reverse()
      .slice(offset, offset + limit);

    return { data, total, limit, offset };
  }
}

module.exports = new LoggerService();
