# Migration Safety Checklist

## ✅ Before Migration (Automated)
- [x] .gitignore created (excludes .env, venv/, *.db)
- [x] Git initialized
- [x] Safe state committed to main branch
- [x] Migration branch created
- [x] Files backed up to .backups/
- [x] Database dumped to SQL
- [x] Rollback script created
- [x] Migration script created

## 🔄 During Migration (Run ./migrate_to_nomic.sh)
- [ ] Test nomic-embed model loads
- [ ] Update index_codebase.py
- [ ] Update search_code.py
- [ ] Update ai_editor_v3.py
- [ ] Drop old database index
- [ ] Re-index with new model
- [ ] Test search quality
- [ ] Test agent responses

## ✅ After Migration
- [ ] Search results improved?
- [ ] No errors in logs?
- [ ] Database size reasonable?
- [ ] Speed acceptable (<200ms)?
- [ ] Accuracy maintained?
- [ ] Commit changes if successful
- [ ] Merge to main
- [ ] Delete migration branch

## 🚨 If Migration Fails
```bash
./rollback_migration.sh
```

## 📊 Expected Improvements
- Search quality: 48% → 65-75% matches
- Code understanding: Better semantic matching
- Context: 512 → 8192 tokens
- Trained on code (not general text)

## 📊 Trade-offs
- Speed: 50ms → 80ms (still fast)
- Size: 90MB → 275MB model
- RAM: 500MB → 1GB (acceptable)

## Success Criteria
✅ Search quality improved
✅ Zero hallucinations maintained
✅ No crashes or errors
✅ Speed <200ms
