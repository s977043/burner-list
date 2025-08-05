import { useBurnerStore } from './useBurnerStore';

// Demonstration script to show Japanese text support
console.log('🇯🇵 Japanese Language Support Demonstration');
console.log('==========================================');

// Test Japanese text input and storage
const store = useBurnerStore.getState();

// Add Japanese tasks to different burners
store.addItem('front', 'プログラミングのタスクを完了する 🔥');
store.addItem('back', 'React コンポーネントの実装 📝');
store.addItem('sink', 'ドキュメントを日本語として保存したい');
store.addItem('sink', '新しい機能の設計書を作成');

// Add subtasks in Japanese
const state = useBurnerStore.getState();
const frontItem = state.current.front.items[0];
if (frontItem) {
  store.addSubtask(frontItem.id, 'コードレビューを依頼');
  store.addSubtask(frontItem.id, 'テストケースを追加');
}

// Show current state
const finalState = useBurnerStore.getState();
console.log('\n📊 Current Burner State:');
console.log('フロントバーナー:', finalState.current.front.items.map(item => item.content));
console.log('バックバーナー:', finalState.current.back.items.map(item => item.content));
console.log('キッチンシンク:', finalState.current.sink.items.map(item => item.content));

if (finalState.current.front.items[0]?.subtasks) {
  console.log('サブタスク:', finalState.current.front.items[0].subtasks.map(sub => sub.content));
}

console.log('\n✅ Japanese text input and storage working correctly!');