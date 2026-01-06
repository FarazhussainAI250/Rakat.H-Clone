from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Data storage (in production, use a proper database)
SUBSCRIPTIONS_FILE = 'subscriptions.json'
ADMIN_CREDENTIALS = {'username': 'admin', 'password': 'admin123'}

def load_subscriptions():
    if os.path.exists(SUBSCRIPTIONS_FILE):
        with open(SUBSCRIPTIONS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_subscriptions(subscriptions):
    with open(SUBSCRIPTIONS_FILE, 'w') as f:
        json.dump(subscriptions, f, indent=2)

def get_plan_counts():
    subscriptions = load_subscriptions()
    active_subs = [s for s in subscriptions if s['status'] == 'Active']
    return {
        'low': len([s for s in active_subs if s['plan'] == 'Low Plan']),
        'middle': len([s for s in active_subs if s['plan'] == 'Middle Plan']),
        'high': len([s for s in active_subs if s['plan'] == 'High Plan'])
    }

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == ADMIN_CREDENTIALS['username'] and password == ADMIN_CREDENTIALS['password']:
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials')
    
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/admin')
@admin_required
def admin_dashboard():
    counts = get_plan_counts()
    return render_template('admin_dashboard.html', counts=counts)

@app.route('/admin/add-subscription', methods=['GET', 'POST'])
@admin_required
def add_subscription():
    if request.method == 'POST':
        subscriptions = load_subscriptions()
        
        new_subscription = {
            'id': len(subscriptions) + 1,
            'email': request.form['email'],
            'plan': request.form['plan'],
            'start_date': request.form['start_date'],
            'expiry_date': request.form['expiry_date'],
            'tokens': int(request.form['tokens']),
            'status': request.form['status'],
            'created_at': datetime.now().isoformat()
        }
        
        subscriptions.append(new_subscription)
        save_subscriptions(subscriptions)
        flash('Subscription activated successfully!')
        return redirect(url_for('subscription_users'))
    
    return render_template('add_subscription.html')

@app.route('/admin/subscription-users')
@admin_required
def subscription_users():
    subscriptions = load_subscriptions()
    return render_template('subscription_users.html', subscriptions=subscriptions)

@app.route('/admin/edit-subscription/<int:sub_id>', methods=['GET', 'POST'])
@admin_required
def edit_subscription(sub_id):
    subscriptions = load_subscriptions()
    subscription = next((s for s in subscriptions if s['id'] == sub_id), None)
    
    if not subscription:
        flash('Subscription not found')
        return redirect(url_for('subscription_users'))
    
    if request.method == 'POST':
        subscription['email'] = request.form['email']
        subscription['plan'] = request.form['plan']
        subscription['start_date'] = request.form['start_date']
        subscription['expiry_date'] = request.form['expiry_date']
        subscription['tokens'] = int(request.form['tokens'])
        subscription['status'] = request.form['status']
        
        save_subscriptions(subscriptions)
        flash('Subscription updated successfully!')
        return redirect(url_for('subscription_users'))
    
    return render_template('edit_subscription.html', subscription=subscription)

@app.route('/admin/delete-subscription/<int:sub_id>')
@admin_required
def delete_subscription(sub_id):
    subscriptions = load_subscriptions()
    subscriptions = [s for s in subscriptions if s['id'] != sub_id]
    save_subscriptions(subscriptions)
    flash('Subscription deleted successfully!')
    return redirect(url_for('subscription_users'))

@app.route('/api/consume-token', methods=['POST'])
def consume_token():
    data = request.json
    email = data.get('email')
    
    subscriptions = load_subscriptions()
    user_sub = next((s for s in subscriptions if s['email'] == email and s['status'] == 'Active'), None)
    
    if not user_sub:
        return jsonify({'error': 'No active subscription found'}), 404
    
    if user_sub['tokens'] <= 0:
        user_sub['status'] = 'Expired'
        save_subscriptions(subscriptions)
        return jsonify({'error': 'No tokens remaining'}), 400
    
    user_sub['tokens'] -= 1
    
    if user_sub['tokens'] == 0:
        user_sub['status'] = 'Expired'
    
    save_subscriptions(subscriptions)
    return jsonify({'tokens_remaining': user_sub['tokens'], 'status': user_sub['status']})

if __name__ == '__main__':
    app.run(debug=True)